import Item from "../models/itemsModel.js";

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  } catch (err) {
    res.status(404).json({
      staus: "fail",
      message: err,
    });
  }
};

export const getItem = async (req, res) => {
  try {
    const customer = await Item.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const createItem = async (req, res) => {
  try {
    // Check if req.body is an array
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Request body must be a non-empty array of items",
      });
    }

    // Map through the array of items to calculate total for each item
    const items = req.body.map((item) => {
      const { description, quantity, total: manualTotal } = item;
      let unitPrice = parseFloat(item.unitPrice);
      let total;

      // If unitPrice is "-", use the manually provided total
      if (item.unitPrice === "-") {
        total = manualTotal ? parseFloat(manualTotal) : 0; // Fallback to 0 if no manual total is provided
        unitPrice = "-"; // Keep unitPrice as "-" for clarity
      } else {
        // Handle invalid or zero unitPrice
        if (isNaN(unitPrice) || unitPrice <= 0) {
          unitPrice = 1; // Default unitPrice if invalid
        }
        total = parseFloat(unitPrice) * parseFloat(quantity);
      }

      return {
        description,
        hsnCode: item.hsnCode,
        unitPrice: unitPrice.toString(), // Store as string to preserve "-"
        quantity: item.quantity,
        total,
      };
    });

    // Use insertMany to create multiple items
    const newItems = await Item.insertMany(items);

    res.status(201).json({
      status: "success",
      data: {
        items: newItems, // Return the newly created items
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Error creating items",
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
