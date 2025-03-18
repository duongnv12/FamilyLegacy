// server/src/controllers/EventController.js
const Event = require('../models/Event');

/**
 * getEvents:
 * Lấy danh sách các sự kiện từ database.
 */
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    next(error);
  }
};

/**
 * createEvent:
 * Tạo mới một sự kiện. Yêu cầu:
 *  - name: tên sự kiện, bắt buộc.
 *  - date: ngày diễn ra sự kiện, bắt buộc.
 *  - location: địa điểm (tùy chọn).
 *  - description: mô tả, ghi chú (tùy chọn).
 */
exports.createEvent = async (req, res, next) => {
  try {
    const { name, date, location, description } = req.body;
    if (!name || !date) {
      return res.status(400).json({ message: "Tên và ngày của sự kiện là bắt buộc." });
    }
    const newEvent = new Event({
      name,
      date,
      location,
      description,
    });
    await newEvent.save();
    res.status(201).json({ message: "Tạo sự kiện thành công.", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    next(error);
  }
};
