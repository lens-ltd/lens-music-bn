import moment from 'moment';
import db from '../../models'

// LOAD MODELS
const { label, user } = db;

class LabelController {
    // CREATE LABEL
    static async createLabel(req, res) {
        try {
            const { name, country, incorporation_date, address } = req.body;
            const { id } = req.user;

            // CREATE LABEL
            const newLabel = await label.create({
                name,
                country,
                incorporation_date: moment(incorporation_date).format(),
                address,
                user_id: id
            });

            return res.status(201).json({ message: 'Label created successfully', data: newLabel });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // LIST LABELS
    static async listLabels(req, res) {
        try {
            const { id, role } = req.user;

            let condition = {};

            if (role !== 'admin') {
                condition.user_id = id;
            }
            // LIST LABELS
            const labels = await label.findAll({
                where: condition,
                include: [
                    {
                        model: user,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            });

            return res.status(200).json({ message: 'Labels listed successfully', data: labels });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // GET LABEL
    static async getLabel(req, res) {
        try {
            const { id } = req.params;

            // GET LABEL
            const labelData = await label.findOne({
                where: { id },
                include: [
                    {
                        model: user,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            });

            if (!labelData) {
                return res.status(404).json({ message: 'Label not found' });
            }

            return res.status(200).json({ message: 'Label retrieved successfully', data: labelData });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // DELETE LABEL
    static async deleteLabel(req, res) {
        try {
            const { id } = req.params;

            // DELETE LABEL
            const deletedLabel = await label.destroy({ where: { id } });

            if (!deletedLabel) {
                return res.status(404).json({ message: 'Label not found' });
            }

            return res.status(204).json({ message: 'Label deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // UPDATE LABEL
    static async updateLabel(req, res) {
        try {
            const { id } = req.params;
            const { name, country, incorporation_date, address } = req.body;
            const { id: user_id, role } = req.user;

            // CHECK IF LABEL EXISTS
            const labelExists = await label.findOne({ where: { id } });

            // RETURN ERROR IF LABEL DOES NOT EXIST
            if (!labelExists) {
                return res.status(404).json({ message: 'Label not found' });
            }

            // CHECK IF LABEL BELONGS TO USER
            if (role !== 'admin' && labelExists.user_id !== user_id) {
                return res.status(403).json({ message: 'Forbidden access' });
            }

            // UPDATE LABEL
            const updatedLabel = await labelExists.update({
                name,
                country,
                incorporation_date: moment(incorporation_date).format(),
                address
            }, { where: { id } });

            return res.status(200).json({ message: 'Label updated successfully', data: updatedLabel });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }
}

export default LabelController;
