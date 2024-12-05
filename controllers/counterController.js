import Counter from "../models/counterModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllCounters = catchAsync(async (req, res) => {
  const counters = await Counter.find();

  res.status(200).json({
    status: "success",
    results: counters.length,
    data: {
      counters,
    },
  });
});
