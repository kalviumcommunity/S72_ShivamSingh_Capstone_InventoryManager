const speech = require('@google-cloud/speech');
const record = require('node-record-lpcm16');
const Product = require('../models/Product');
const { createNotification } = require('../middleware/auth');

// Initialize Google Cloud Speech-to-Text client
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Voice command patterns
const commandPatterns = {
  addStock: /add (\d+) (?:units? of )?([\w\s]+)/i,
  checkStock: /check (?:stock of )?([\w\s]+)/i,
  updatePrice: /update price of ([\w\s]+) to (\d+)/i,
  findProduct: /find (?:product )?([\w\s]+)/i
};

// Process voice command
exports.processVoiceCommand = async (req, res) => {
  try {
    const { audioData } = req.body;

    // Configure request for Google Cloud Speech-to-Text
    const audio = {
      content: audioData.toString('base64')
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true
    };

    const request = {
      audio: audio,
      config: config
    };

    // Perform transcription
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Process command
    const command = await processCommand(transcription, req.user);

    res.status(200).json({
      success: true,
      data: {
        transcription,
        command
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Process transcribed command
const processCommand = async (transcription, user) => {
  // Check for add stock command
  const addStockMatch = transcription.match(commandPatterns.addStock);
  if (addStockMatch) {
    const [, quantity, productName] = addStockMatch;
    return await handleAddStock(productName, parseInt(quantity), user);
  }

  // Check for check stock command
  const checkStockMatch = transcription.match(commandPatterns.checkStock);
  if (checkStockMatch) {
    const [, productName] = checkStockMatch;
    return await handleCheckStock(productName, user);
  }

  // Check for update price command
  const updatePriceMatch = transcription.match(commandPatterns.updatePrice);
  if (updatePriceMatch) {
    const [, productName, newPrice] = updatePriceMatch;
    return await handleUpdatePrice(productName, parseFloat(newPrice), user);
  }

  // Check for find product command
  const findProductMatch = transcription.match(commandPatterns.findProduct);
  if (findProductMatch) {
    const [, productName] = findProductMatch;
    return await handleFindProduct(productName, user);
  }

  return {
    success: false,
    message: 'Command not recognized'
  };
};

// Handle add stock command
const handleAddStock = async (productName, quantity, user) => {
  try {
    const product = await Product.findOne({
      name: { $regex: new RegExp(productName, 'i') }
    });

    if (!product) {
      return {
        success: false,
        message: `Product "${productName}" not found`
      };
    }

    // Check if user has permission to modify stock
    if (user.role !== 'Store Manager') {
      return {
        success: false,
        message: 'You do not have permission to modify stock'
      };
    }

    product.currentStock += quantity;
    await product.save();

    // Create notification
    await createNotification(
      'Inventory Adjustment',
      'Stock Added',
      `${quantity} units of "${product.name}" have been added to stock.`,
      [user._id]
    );

    return {
      success: true,
      message: `Added ${quantity} units of "${product.name}" to stock`,
      data: product
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Handle check stock command
const handleCheckStock = async (productName, user) => {
  try {
    const product = await Product.findOne({
      name: { $regex: new RegExp(productName, 'i') }
    });

    if (!product) {
      return {
        success: false,
        message: `Product "${productName}" not found`
      };
    }

    return {
      success: true,
      message: `Current stock of "${product.name}": ${product.currentStock} units`,
      data: product
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Handle update price command
const handleUpdatePrice = async (productName, newPrice, user) => {
  try {
    const product = await Product.findOne({
      name: { $regex: new RegExp(productName, 'i') }
    });

    if (!product) {
      return {
        success: false,
        message: `Product "${productName}" not found`
      };
    }

    // Check if user has permission to modify prices
    if (user.role !== 'Store Manager') {
      return {
        success: false,
        message: 'You do not have permission to modify prices'
      };
    }

    product.price = newPrice;
    await product.save();

    // Create notification
    await createNotification(
      'Price Update',
      'Price Updated',
      `Price of "${product.name}" has been updated to ${newPrice}.`,
      [user._id]
    );

    return {
      success: true,
      message: `Updated price of "${product.name}" to ${newPrice}`,
      data: product
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Handle find product command
const handleFindProduct = async (productName, user) => {
  try {
    const product = await Product.findOne({
      name: { $regex: new RegExp(productName, 'i') }
    });

    if (!product) {
      return {
        success: false,
        message: `Product "${productName}" not found`
      };
    }

    return {
      success: true,
      message: `Found "${product.name}"`,
      data: product
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Start voice recording
exports.startRecording = (req, res) => {
  try {
    const recording = record.record({
      sampleRate: 16000,
      channels: 1,
      audioType: 'raw'
    });

    // Store recording in request for later processing
    req.recording = recording;

    res.status(200).json({
      success: true,
      message: 'Voice recording started'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Stop voice recording
exports.stopRecording = (req, res) => {
  try {
    if (req.recording) {
      req.recording.stop();
      res.status(200).json({
        success: true,
        message: 'Voice recording stopped'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No active recording found'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 