#!/usr/bin/env node

/**
 * Build Environment Loader for Frontend
 * Reads .env file and generates js/env-loader.js for browser consumption
 */

const fs = require('fs');
const path = require('path');

function buildEnvLoader() {
    console.log('🔧 Building environment loader from .env file...');
    
    const envPath = path.join(__dirname, '.env');
    const outputPath = path.join(__dirname, 'js', 'env-loader.js');
    
    // Check if .env exists
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file not found. Please create one with your API keys.');
        process.exit(1);
    }
    
    // Read .env file
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    // Parse .env file
    envContent.split('\n').forEach(line => {
        line = line.trim();
        
        // Skip comments and empty lines
        if (line.startsWith('#') || !line) return;
        
        // Parse KEY=VALUE pairs
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            let value = valueParts.join('=').trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Convert boolean strings
            if (value.toLowerCase() === 'true') value = true;
            else if (value.toLowerCase() === 'false') value = false;
            
            envVars[key] = value;
        }
    });
    
    // Generate JavaScript content
    const jsContent = `// Environment Variables Loader for Frontend
// This file is auto-generated from .env - do not edit manually
// Run: node build-env.js to regenerate

window.ENV = ${JSON.stringify(envVars, null, 4)};

console.log('🌍 Environment variables loaded:', {
    'GCP_API_KEY': window.ENV.GCP_API_KEY ? '✅ Set' : '❌ Missing',
    'GCP_PROJECT_ID': window.ENV.GCP_PROJECT_ID || 'Not set',
    'APP_ENV': window.ENV.APP_ENV || 'production',
    'DEBUG_MODE': window.ENV.DEBUG_MODE ? 'Enabled' : 'Disabled'
});

// Debug information
if (window.ENV.DEBUG_MODE) {
    console.log('🐛 Debug mode enabled');
    console.log('📋 All environment variables:', window.ENV);
}
`;
    
    // Write the file
    fs.writeFileSync(outputPath, jsContent);
    
    console.log('✅ Environment loader generated successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log('📊 Variables loaded:', Object.keys(envVars).length);
    console.log('🔑 API Key configured:', !!envVars.GCP_API_KEY);
    console.log('📋 Project ID configured:', !!envVars.GCP_PROJECT_ID);
}

// Run if called directly
if (require.main === module) {
    buildEnvLoader();
}

module.exports = buildEnvLoader; 