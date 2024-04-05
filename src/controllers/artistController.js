import db from '../../models'
import { getPagination, getPagingData } from '../utils/pagination';
import { uploadBlob } from '../utils/uploads';

// LOAD MODELS
const { label, user, artist } = db;

class ArtistController {
    // CREATE ARTIST
    static async createArtist(req, res) {
        try {
            const { name, label_id } = req.body;
            const { id: user_id } = req.user;
            const { file } = req;
            let uploadedAvatar;

            // CHECK IF LABEL EXISTS
            if (label_id) {
                const labelExists = await label.findOne({ where: { id: label_id } });
                // RETURN ERROR IF LABEL DOES NOT EXIST
                if (!labelExists) {
                    return res.status(404).json({ message: 'Label not found' });
                }
            }

            // CHECK IF USER EXISTS
            const userExists = await user.findOne({ where: { id: user_id } });

            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }

            // UPLOAD AVATAR
            if (file) {
                uploadedAvatar = await uploadBlob(file, {
                    name: `${user_id}-${Date.now().toString()}`,
                });
            }

            // CREATE ARTIST
            const newArtist = await artist.create({
                name,
                label_id,
                user_id,
                avatar: uploadedAvatar?.url,
            });

            // RETURN RESPONSE
            return res.status(201).json({ message: 'Artist created successfully', data: newArtist });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // LIST ARTISTS
    static async listArtists(req, res) {
        try {

            const { id, role } = req.user;
            const { page, size } = req.query;

            const { limit, offset } = getPagination(page, size);

            let condition = {};

            if (role === 'user') {
                condition = { user_id: id };
            }

            // LIST ARTISTS
            const artists = await artist.findAndCountAll({
                where: condition,
                limit,
                offset,
                include: [
                    {
                        model: label,
                        as: 'label',
                        attributes: ['id', 'name', 'country'],
                    },
                    {
                        model: user,
                        as: 'user',
                        attributes: ['id', 'name', 'role', 'email'],
                    },
                ],
            });

            // RETURN RESPONSE
            return res.status(200).json({ data: getPagingData(artists, page, limit)});
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // GET ARTIST
    static async getArtist(req, res) {
        try {
            const { id } = req.params;

            // GET ARTIST
            const artistData = await artist.findOne({
                where: { id },
                include: [
                    {
                        model: label,
                        as: 'label',
                        attributes: ['id', 'name', 'country'],
                    },
                    {
                        model: user,
                        as: 'user',
                        attributes: ['id', 'name', 'role', 'email'],
                    },
                ],
            });

            // RETURN ERROR IF ARTIST DOES NOT EXIST
            if (!artistData) {
                return res.status(404).json({ message: 'Artist not found' });
            }

            // RETURN RESPONSE
            return res.status(200).json({ message: 'Artist found successfully', data: artistData });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // DELETE ARTIST
    static async deleteArtist(req, res) {
        try {
            const { id } = req.params;

            // DELETE ARTIST
            const deletedArtist = await artist.destroy({ where: { id } });

            // RETURN ERROR IF ARTIST DOES NOT EXIST
            if (!deletedArtist) {
                return res.status(404).json({ message: 'Artist not found' });
            }

            // RETURN RESPONSE
            return res.status(204).json({ message: 'Artist deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }

    // UPDATE ARTIST
    static async updateArtist(req, res) {
        try {
            const { id } = req.params;
            const { name, label_id } = req.body;
            const { id: user_id } = req.user;
            const { file } = req;
            let uploadedAvatar;

            // CHECK IF ARTIST EXISTS
            const artistExists = await artist.findOne({ where: { id } });

            // CHECK IF LABEL EXISTS
            const labelExists = await label.findOne({ where: { id: label_id } });

            // CHECK IF USER EXISTS
            const userExists = await user.findOne({ where: { id: user_id } });

            // RETURN ERROR IF ARTIST, LABEL OR USER DOES NOT EXIST
            if (!artistExists) {
                return res.status(404).json({ message: 'Artist not found' });
            }

            if (!labelExists) {
                return res.status(404).json({ message: 'Label not found' });
            }

            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }

            // UPLOAD AVATAR
            if (file) {
                uploadedAvatar = await uploadBlob(file, {
                    name: `${user_id}-${Date.now().toString()}`,
                });
            }

            // UPDATE ARTIST
            const updatedArtist = await artistExists.update(
                {
                    name: name || artistExists.name,
                    label_id: label_id || artistExists?.label_id,
                    user_id,
                    avatar: uploadedAvatar?.url || artistExists?.avatar,
                },
                { where: { id } }
            );

            // RETURN RESPONSE
            return res.status(200).json({ message: 'Artist updated successfully', data: updatedArtist });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }
}

export default ArtistController;
