const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { assessmentData, users } = require('./data');
const { assessmentConfigs, getValueFromPath, classifyValue } = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure reports directory exists
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate PDF Report
app.post('/api/generate-report', authenticateToken, async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ message: 'session_id is required' });
    }

    // Find assessment data
    const assessment = assessmentData.find(item => item.session_id === session_id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment data not found for the given session_id' });
    }

    const assessmentId = assessment.assessment_id;
    const config = assessmentConfigs[assessmentId];

    if (!config) {
      return res.status(400).json({ message: `Configuration not found for assessment type: ${assessmentId}` });
    }

    // Generate report data
    const reportData = {
      assessmentName: config.name,
      sessionId: session_id,
      generatedAt: new Date().toISOString(),
      sections: []
    };

    // Process each section
    for (const section of config.sections) {
      const sectionData = {
        id: section.id,
        title: section.title,
        fields: []
      };

      for (const field of section.fields) {
        const value = getValueFromPath(assessment, field.path);
        const classification = field.classification ? classifyValue(value, field.classification) : null;

        sectionData.fields.push({
          key: field.key,
          label: field.label,
          value: value,
          unit: field.unit,
          type: field.type,
          classification: classification
        });
      }

      reportData.sections.push(sectionData);
    }

    // Generate HTML for PDF
    const htmlContent = generateReportHTML(reportData);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(reportsDir, `report_${session_id}_${Date.now()}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    res.json({
      message: 'Report generated successfully',
      session_id: session_id,
      pdf_path: pdfPath,
      download_url: `/api/reports/${path.basename(pdfPath)}`
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
});

// Serve generated PDFs without authentication
app.get('/api/reports/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(reportsDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Report not found' });
  }

  res.download(filePath);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Assessment Management System API is running' });
});

// Generate HTML for PDF report
function generateReportHTML(reportData) {
  const getColorClass = (color) => {
    const colorMap = {
      red: 'text-red-600 bg-red-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      gray: 'text-gray-600 bg-gray-50'
    };
    return colorMap[color] || colorMap.gray;
  };

  const sectionsHTML = reportData.sections.map(section => `
    <div class="section mb-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
        ${section.title}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${section.fields.map(field => `
          <div class="field bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-gray-700">${field.label}</span>
              ${field.classification ? `
                <span class="px-2 py-1 rounded-full text-xs font-medium ${getColorClass(field.classification.color)}">
                  ${field.classification.label}
                </span>
              ` : ''}
            </div>
            <div class="text-2xl font-bold text-gray-900">
              ${field.value !== null && field.value !== undefined ? field.value : 'N/A'}
              ${field.unit ? `<span class="text-sm font-normal text-gray-500 ml-1">${field.unit}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reportData.assessmentName} - Report</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page {
          margin: 20px;
        }
        body {
          font-family: 'Inter', sans-serif;
        }
      </style>
    </head>
    <body class="bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8 pb-6 border-b-2 border-gray-200">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">${reportData.assessmentName}</h1>
          <p class="text-gray-600">Session ID: ${reportData.sessionId}</p>
          <p class="text-sm text-gray-500 mt-2">Generated on: ${new Date(reportData.generatedAt).toLocaleString()}</p>
        </div>

        <!-- Report Content -->
        <div class="report-content">
          ${sectionsHTML}
        </div>

        <!-- Footer -->
        <div class="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Assessment Management System - Confidential Report</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Start server
app.listen(PORT, () => {
  console.log(`Assessment Management System API running on port ${PORT}`);
});

module.exports = app;
