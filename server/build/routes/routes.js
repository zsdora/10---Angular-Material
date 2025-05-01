"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const User_1 = require("../model/User");
const Booking_1 = require("../model/Booking");
const Hotel_1 = require("../model/Hotel");
const Offer_1 = require("../model/Offer");
const Room_1 = require("../model/Room");
const configureRoutes = (passport, router) => {
    // Middleware-ek
    const isAdmin = (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            next();
        }
        else {
            res.status(403).send('Admin jogosultság szükséges!');
        }
    };
    const isAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ message: 'Unauthorized' });
    };
    // Alap útvonalak (meghagyható)
    router.get('/', (req, res) => {
        res.status(200).send('Hotel Foglaló Rendszer API');
    });
    // ======================
    // Hitelesítés útvonalak
    // ======================
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error)
                return res.status(500).send(error);
            if (!user)
                return res.status(400).send('User not found.');
            req.login(user, (err) => {
                if (err)
                    return res.status(500).send('Internal server error.');
                const userObj = user.toObject();
                delete userObj.password;
                res.status(200).send(userObj);
            });
        })(req, res, next);
    });
    router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, name, address, nickname } = req.body;
            // Check if user already exists
            const existingUser = yield User_1.User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already registered' });
            }
            const user = new User_1.User({
                email: email.toLowerCase(),
                password,
                name: name || '',
                address: address || '',
                nickname: nickname || '',
                role: 'user'
            });
            const savedUser = yield user.save();
            const userObj = savedUser.toObject();
            delete userObj.password;
            return res.status(201).json(userObj);
        }
        catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Registration failed' });
        }
    }));
    router.post('/logout', isAuthenticated, (req, res) => {
        req.logout((error) => {
            if (error)
                return res.status(500).send('Kijelentkezési hiba');
            res.status(200).send('Sikeres kijelentkezés');
        });
    });
    // ======================
    // Felhasználó kezelés (Admin)
    // ======================
    router.get('/users', isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield User_1.User.find().select('-password');
            res.status(200).send(users);
        }
        catch (error) {
            res.status(500).send('Felhasználók betöltése sikertelen');
        }
    }));
    router.get('/users/current', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user._id;
            const user = yield User_1.User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        }
        catch (error) {
            console.error('Error fetching current user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
    router.post('/users', isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, role, name, address, nickname } = req.body;
            if (!email || !password || !role) {
                return res.status(400).send('Kötelező mezők: email, password, role');
            }
            const user = new User_1.User({
                email,
                password,
                role,
                name: name || '',
                address: address || '',
                nickname: nickname || ''
            });
            const savedUser = yield user.save();
            const userObj = savedUser.toObject();
            delete userObj.password;
            res.status(201).send(userObj);
        }
        catch (error) {
            if (error.code === 11000) {
                return res.status(409).send('Ez az email cím már foglalt');
            }
            if (error.name === 'ValidationError') {
                return res.status(400).send('Hiányzó vagy hibás mezők: ' + error.message);
            }
            res.status(500).send('Hiba a felhasználó létrehozásakor');
        }
    }));
    router.get('/users/profile', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the user ID from the authenticated request
            const userId = req.user._id;
            // Find the user and exclude password field
            const user = yield User_1.User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
    router.put('/users/profile', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user._id;
            const { name, address, nickname } = req.body;
            const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { name, address, nickname }, { new: true }).select('-password');
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updatedUser);
        }
        catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
    router.delete('/users/:id', isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedUser = yield User_1.User.findByIdAndDelete(req.params.id);
            if (!deletedUser)
                return res.status(404).send('Felhasználó nem található');
            res.status(200).send('Felhasználó sikeresen törölve');
        }
        catch (error) {
            res.status(500).send('Törlési hiba');
        }
    }));
    // ======================
    // Szálloda útvonalak
    // ======================
    router.get('/hotels/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Getting hotel with ID:', req.params.id);
            const hotel = yield Hotel_1.Hotel.findById(req.params.id).select('-__v');
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
            const hotelWithImagePath = Object.assign(Object.assign({}, hotel.toObject()), { photos: hotel.photos ? `/assets/images/${hotel.photos}` : null });
            console.log('Found hotel:', hotelWithImagePath);
            res.json(hotelWithImagePath);
        }
        catch (error) {
            console.error('Error fetching hotel:', error);
            res.status(500).json({ message: 'Error fetching hotel details' });
        }
    }));
    router.get('/hotels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('GET /hotels endpoint hit');
        try {
            const hotels = yield Hotel_1.Hotel.find().select('-__v');
            const hotelsWithImagePaths = hotels.map(hotel => (Object.assign(Object.assign({}, hotel.toObject()), { photos: hotel.photos ? `/assets/images/${hotel.photos}` : null })));
            console.log('Found hotels:', hotelsWithImagePaths);
            res.json(hotelsWithImagePaths);
        }
        catch (error) {
            console.error('Error fetching hotels:', error);
            res.status(500).json({ message: 'Error fetching hotels' });
        }
    }));
    router.post('/hotels', isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hotel = new Hotel_1.Hotel(req.body);
            const savedHotel = yield hotel.save();
            res.status(201).send(savedHotel);
        }
        catch (error) {
            res.status(400).send('Érvénytelen adatok');
        }
    }));
    router.put('/hotels/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hotelId = req.params.id;
            const updates = req.body;
            // Log the update request
            console.log('Updating hotel:', hotelId, updates);
            const updatedHotel = yield Hotel_1.Hotel.findByIdAndUpdate(hotelId, { $set: updates }, { new: true, runValidators: true });
            if (!updatedHotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
            res.json(updatedHotel);
        }
        catch (error) {
            console.error('Error updating hotel:', error);
            res.status(500).json({ message: 'Error updating hotel', error: error });
        }
    }));
    router.delete('/hotels/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield Hotel_1.Hotel.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
            res.json({ message: 'Hotel deleted successfully' });
        }
        catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ message: 'Error deleting hotel', error: error });
        }
    }));
    // ======================
    // Szoba útvonalak (REST-es szerkezet)
    // ======================
    router.get('/hotels/:hotelId/rooms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rooms = yield Room_1.Room.find({ hotel_id: req.params.hotelId });
            res.status(200).send(rooms);
        }
        catch (error) {
            res.status(500).send('Szobák betöltése sikertelen');
        }
    }));
    router.post('/hotels/:hotelId/rooms', isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const room = new Room_1.Room(Object.assign(Object.assign({}, req.body), { hotel_id: req.params.hotelId }));
            const savedRoom = yield room.save();
            // opcionális: hotel-rooms kapcsolat frissítése
            res.status(201).send(savedRoom);
        }
        catch (error) {
            res.status(400).send('Érvénytelen szobaadatok');
        }
    }));
    router.get('/rooms', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('GET /rooms route hit');
        try {
            const rooms = yield Room_1.Room.find()
                .populate({
                path: 'hotel_id',
                select: 'name city'
            });
            console.log('Found rooms:', rooms);
            res.status(200).json(rooms);
        }
        catch (error) {
            console.error('Error in /rooms route:', error);
            res.status(500).json({ message: 'Failed to load rooms' });
        }
    }));
    router.post('/rooms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Received room creation request:', req.body);
            // Validate required fields
            const { hotel_id, room_type, price } = req.body;
            if (!hotel_id || !room_type || !price) {
                return res.status(400).json({
                    message: 'Missing required fields: hotel_id, room_type, or price'
                });
            }
            // Verify hotel exists
            const hotel = yield Hotel_1.Hotel.findById(hotel_id);
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
            const room = new Room_1.Room({
                hotel_id,
                room_type,
                price,
                status: req.body.status || 'Available',
                amenities: req.body.amenities || [],
                description: req.body.description || ''
            });
            const savedRoom = yield room.save();
            console.log('Room created successfully:', savedRoom);
            // Populate hotel information
            const populatedRoom = yield Room_1.Room.findById(savedRoom._id)
                .populate('hotel_id', 'name city');
            res.status(201).json(populatedRoom);
        }
        catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({
                message: 'Error creating room',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }));
    router.delete('/rooms/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomId = req.params.id;
            console.log('Attempting to delete room:', roomId);
            const deletedRoom = yield Room_1.Room.findByIdAndDelete(roomId);
            if (!deletedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }
            console.log('Room deleted successfully:', deletedRoom);
            res.status(200).json({ message: 'Room deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({
                message: 'Error deleting room',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }));
    // ======================
    // Foglalás útvonalak
    // ======================
    console.log('Configuring routes...');
    router.get('/bookings', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('GET /bookings route hit');
        try {
            const bookings = yield Booking_1.Booking.find({ user_id: req.user._id })
                .populate('hotel_id', 'name city')
                .populate('room_id', 'price room_type');
            console.log('Found bookings for user:', bookings);
            res.status(200).json(bookings);
        }
        catch (error) {
            console.error('Error in /bookings route:', error);
            res.status(500).json({ message: 'Failed to load bookings' });
        }
    }));
    router.post('/bookings', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate required fields
            const { hotel_id, room_id, check_in, check_out } = req.body;
            if (!hotel_id || !room_id || !check_in || !check_out) {
                return res.status(400).json({
                    message: 'Missing required fields'
                });
            }
            const booking = new Booking_1.Booking(Object.assign(Object.assign({}, req.body), { user_id: req.user._id, status: 'confirmed' }));
            const savedBooking = yield booking.save();
            res.status(201).json(savedBooking);
        }
        catch (error) {
            console.error('Error creating booking:', error);
            res.status(400).json({
                message: 'Invalid booking data',
                error: error.message
            });
        }
    }));
    router.patch('/bookings/:id/cancel', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const booking = yield Booking_1.Booking.findOne({
                _id: req.params.id,
                user_id: req.user._id
            });
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            if (booking.status === 'cancelled') {
                return res.status(400).json({ message: 'Booking is already cancelled' });
            }
            booking.status = 'cancelled';
            yield booking.save();
            res.status(200).json(booking);
        }
        catch (error) {
            console.error('Error cancelling booking:', error);
            res.status(500).json({ message: 'Failed to cancel booking' });
        }
    }));
    router.get('/bookings/all', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('GET /app/bookings/all route hit');
        try {
            const allBookings = yield Booking_1.Booking.find()
                .populate({
                path: 'user_id',
                select: 'name email'
            })
                .populate({
                path: 'hotel_id',
                select: 'name city'
            })
                .populate({
                path: 'room_id',
                select: 'room_type price'
            });
            // Keep the original structure but ensure populated fields are handled safely
            const transformedBookings = allBookings.map(booking => ({
                _id: booking._id,
                user_id: booking.user_id,
                hotel_id: booking.hotel_id,
                room_id: booking.room_id,
                check_in: booking.check_in,
                check_out: booking.check_out,
                price: booking.price,
                status: booking.status
            }));
            console.log('Found all bookings:', transformedBookings);
            res.status(200).json(transformedBookings);
        }
        catch (error) {
            console.error('Error in /app/bookings/all route:', error);
            res.status(500).json({ message: 'Failed to load all bookings' });
        }
    }));
    // ======================
    // Ajánlat útvonalak
    // ======================
    router.get('/offers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const offers = yield Offer_1.Offer.find({ is_active: true })
                .populate('hotel_id', 'name amenities');
            res.status(200).send(offers);
        }
        catch (error) {
            res.status(500).send('Ajánlatok betöltése sikertelen');
        }
    }));
    router.post('/offers', isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const offer = new Offer_1.Offer(req.body);
            const savedOffer = yield offer.save();
            res.status(201).send(savedOffer);
        }
        catch (error) {
            res.status(400).send('Érvénytelen ajánlati adatok');
        }
    }));
    // ======================
    // Egyéb endpointok törölve (getAllUsers, deleteUser, checkAuth)
    // ======================
    return router;
};
exports.configureRoutes = configureRoutes;
