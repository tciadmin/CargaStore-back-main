import { Request, Response } from 'express';
import FeedbackModel from '../models/feedbacks.model';
import DriversModel from '../models/drivers.model';
import { CustomerModel } from '../models';

const createFeedback = async (req: Request, res: Response) => {
  try {
    const { customerId, driverId, comment, score } = req.body;

    // Validaciones
    const driver = await DriversModel.findByPk(driverId);
    const customer = await CustomerModel.findByPk(customerId);
    if (!driver) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    if (!customer) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }
    if (!comment || comment.trim() === '') {
      return res
        .status(400)
        .json({ error: 'Comentario no puede estar vacio' });
    }
    if (
      score === undefined ||
      score === null ||
      typeof score !== 'number'
    ) {
      return res
        .status(400)
        .json({ error: 'La puntuacion no puede estar vacia' });
    }

    const feedback = await FeedbackModel.create({
      customerId,
      driverId,
      comment,
      score,
    });

    const allFeedBack = await FeedbackModel.findAll({
      where: { driverId },
    });
    const totalRating = allFeedBack.reduce(
      (acc, feedBack) => acc + feedBack.score,
      0
    );
    const averageRating = totalRating / allFeedBack.length;
    driver.feedback_count = driver.feedback_count + 1;
    driver.rating = parseFloat(averageRating.toFixed(1));
    await driver?.save();

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFeedbacks = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Find driver by userId to get driverId
    const driver = await DriversModel.findOne({ where: { userId } });
    if (!driver) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }

    // Find feedbacks by driverId
    const feedbacks = await FeedbackModel.findAll({
      where: { driverId: driver.id },
    });

    return res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { createFeedback, getFeedbacks };
