import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { Booking } from '../model/Booking';
import { Hotel } from '../model/Hotel';
import { Offer } from '../model/Offer';
import { Room } from '../model/Room';

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    // Middleware-ek
    const isAdmin = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated() && (req.user as any).role === 'admin') {
            next();
        } else {
            res.status(403).send('Admin jogosultság szükséges!');
        }
    };

    const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ message: 'Unauthorized' });
    };

    // Alap útvonalak (meghagyható)
    router.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hotel Foglaló Rendszer API');
    });

    // ======================
    // Hitelesítés útvonalak
    // ======================
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) return res.status(500).send(error);
            if (!user) return res.status(400).send('User not found.');
            req.login(user, (err: string | null) => {
                if (err) return res.status(500).send('Internal server error.');
                const userObj = (user as any).toObject();
                delete (userObj as { password?: string }).password;
                res.status(200).send(userObj);
            });
        })(req, res, next);
    });

    router.post('/register', async (req: Request, res: Response) => {
        try {
            const { email, password, name, address, nickname } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already registered' });
            }
    
            const user = new User({
                email: email.toLowerCase(),
                password,
                name: name || '',
                address: address || '',
                nickname: nickname || '',
                role: 'user'
            });
    
            const savedUser = await user.save();
            const userObj = savedUser.toObject();
            delete (userObj as any).password;
    
            return res.status(201).json(userObj);
        } catch (error: any) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Registration failed' });
        }
    });

    router.post('/logout', isAuthenticated, (req: Request, res: Response) => {
        req.logout((error) => {
            if (error) return res.status(500).send('Kijelentkezési hiba');
            res.status(200).send('Sikeres kijelentkezés');
        });
    });

    // ======================
    // Felhasználó kezelés (Admin)
    // ======================
    router.get('/users', isAdmin, async (req: Request, res: Response) => {
        try {
            const users = await User.find().select('-password');
            res.status(200).send(users);
        } catch (error) {
            res.status(500).send('Felhasználók betöltése sikertelen');
        }
    });
    
    router.get('/users/current', isAuthenticated, async (req: Request, res: Response) => {
        try {
            const userId = (req.user as any)._id;
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching current user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.post('/users', isAdmin, async (req: Request, res: Response) => {
        try {
            const { email, password, role, name, address, nickname } = req.body;
            if (!email || !password || !role) {
                return res.status(400).send('Kötelező mezők: email, password, role');
            }
            const user = new User({
                email,
                password,
                role,
                name: name || '',
                address: address || '',
                nickname: nickname || ''
            });
            const savedUser = await user.save();
            const userObj = savedUser.toObject();
            delete (userObj as { password?: string }).password;
            res.status(201).send(userObj);
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(409).send('Ez az email cím már foglalt');
            }
            if (error.name === 'ValidationError') {
                return res.status(400).send('Hiányzó vagy hibás mezők: ' + error.message);
            }
            res.status(500).send('Hiba a felhasználó létrehozásakor');
        }
    });

    router.get('/users/profile', isAuthenticated, async (req: Request, res: Response) => {
        try {
            // Get the user ID from the authenticated request
            const userId = (req.user as any)._id;
            
            // Find the user and exclude password field
            const user = await User.findById(userId).select('-password');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json(user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.put('/users/profile', isAuthenticated, async (req: Request, res: Response) => {
        try {
            const userId = (req.user as any)._id;
            const { name, address, nickname } = req.body;
            
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, address, nickname },
                { new: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.delete('/users/:id', isAdmin, async (req: Request, res: Response) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).send('Felhasználó nem található');
            res.status(200).send('Felhasználó sikeresen törölve');
        } catch (error) {
            res.status(500).send('Törlési hiba');
        }
    });

    // ======================
    // Szálloda útvonalak
    // ======================

    router.get('/hotels/:id', async (req: Request, res: Response) => {
        try {
            console.log('Getting hotel with ID:', req.params.id);
            const hotel = await Hotel.findById(req.params.id).select('-__v');
            
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
            
            const hotelWithImagePath = {
                ...hotel.toObject(),
                photos: hotel.photos || null  // Remove the /assets/images/ prefix
            };
    
            console.log('Found hotel:', hotelWithImagePath);
            res.json(hotelWithImagePath);
        } catch (error) {
            console.error('Error fetching hotel:', error);
            res.status(500).json({ message: 'Error fetching hotel details' });
        }
    });

    router.get('/hotels', async (req: Request, res: Response) => {
        console.log('GET /hotels endpoint hit');
        try {
            const hotels = await Hotel.find().select('-__v');

            const hotelsWithImagePaths = hotels.map(hotel => ({
                ...hotel.toObject(),
                photos: hotel.photos || null
            }));
            console.log('Found hotels:', hotelsWithImagePaths);
            res.json(hotelsWithImagePaths);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            res.status(500).json({ message: 'Error fetching hotels' });
        }
    });

    router.post('/hotels', isAdmin, async (req: Request, res: Response) => {
        try {
            const hotel = new Hotel(req.body);
            const savedHotel = await hotel.save();
            res.status(201).send(savedHotel);
        } catch (error) {
            res.status(400).send('Érvénytelen adatok');
        }
    });

    router.put('/hotels/:id', async (req, res) => {
        try {
          const hotelId = req.params.id;
          const updates = req.body;
          
          // Log the update request
          console.log('Updating hotel:', hotelId, updates);
      
          const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $set: updates },
            { new: true, runValidators: true }
          );
      
          if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
          }
      
          res.json(updatedHotel);
        } catch (error) {
          console.error('Error updating hotel:', error);
          res.status(500).json({ message: 'Error updating hotel', error: error });
        }
      });

    router.delete('/hotels/:id', async (req, res) => {
        try {
          const result = await Hotel.findByIdAndDelete(req.params.id);
          if (!result) {
            return res.status(404).json({ message: 'Hotel not found' });
          }
          res.json({ message: 'Hotel deleted successfully' });
        } catch (error) {
          console.error('Delete error:', error);
          res.status(500).json({ message: 'Error deleting hotel', error: error });
        }
      });

    // ======================
    // Szoba útvonalak (REST-es szerkezet)
    // ======================
    router.get('/hotels/:hotelId/rooms', async (req: Request, res: Response) => {
        try {
            const rooms = await Room.find({ hotel_id: req.params.hotelId }) as Array<{ _id: string }>;
            res.status(200).send(rooms);
        } catch (error) {
            res.status(500).send('Szobák betöltése sikertelen');
        }
    });

    router.post('/hotels/:hotelId/rooms', isAdmin, async (req: Request, res: Response) => {
        try {
            const room = new Room({
                ...req.body,
                hotel_id: req.params.hotelId
            });
            const savedRoom = await room.save();
            // opcionális: hotel-rooms kapcsolat frissítése
            res.status(201).send(savedRoom);
        } catch (error) {
            res.status(400).send('Érvénytelen szobaadatok');
        }
    });

    router.get('/hotels/:hotelId/rooms/available', async (req: Request, res: Response) => {
    try {
        const hotelId = req.params.hotelId;
        const checkIn = new Date(req.query.checkIn as string);
        const checkOut = new Date(req.query.checkOut as string);

        // First, get all rooms for this hotel
        const rooms = await Room.find({ hotel_id: hotelId });

        // Then, get all bookings that overlap with the requested dates
        const bookings = await Booking.find({
            'hotel_id._id': hotelId,
            status: { $ne: 'cancelled' }, // Exclude cancelled bookings
            $or: [
                {
                    check_in: { $lte: checkOut },
                    check_out: { $gte: checkIn }
                }
            ]
        });

        // Get room IDs that are booked for these dates, with null check
        const bookedRoomIds = bookings
            .filter(booking => booking.room_id && booking.room_id._id) // Filter out null/undefined
            .map(booking => booking.room_id?._id?.toString())
            .filter((roomId): roomId is string => !!roomId);

        // Filter out booked rooms
        const availableRooms = rooms.filter(room => 
            !bookedRoomIds.includes((room._id as string).toString()) // Use _id instead of id
        );

        console.log(`Found ${availableRooms.length} available rooms`);
        res.json(availableRooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ 
            message: 'Error fetching available rooms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

    router.get('/rooms', isAuthenticated, async (req: Request, res: Response) => {
        console.log('GET /rooms route hit');
        try {
            const rooms = await Room.find()
                .populate({
                    path: 'hotel_id',
                    select: 'name city'
                });
    
            console.log('Found rooms:', rooms);
            res.status(200).json(rooms);
        } catch (error: any) {
            console.error('Error in /rooms route:', error);
            res.status(500).json({ message: 'Failed to load rooms' });
        }
    });

    router.post('/rooms', async (req: Request, res: Response) => {
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
            const hotel = await Hotel.findById(hotel_id);
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
    
            const room = new Room({
                hotel_id,
                room_type,
                price,
                status: req.body.status || 'Available',
                amenities: req.body.amenities || [],
                description: req.body.description || ''
            });
    
            const savedRoom = await room.save();
            console.log('Room created successfully:', savedRoom);
            
            // Populate hotel information
            const populatedRoom = await Room.findById(savedRoom._id)
                .populate('hotel_id', 'name city');
                
            res.status(201).json(populatedRoom);
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ 
                message: 'Error creating room', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    });

    router.put('/rooms/:id', async (req: Request, res: Response) => {
        try {
            const roomId = req.params.id;
            const updates = req.body;

            // Validate hotel exists if hotel_id is being updated
            if (updates.hotel_id) {
                const hotel = await Hotel.findById(updates.hotel_id);
                if (!hotel) {
                    return res.status(404).json({ message: 'Hotel not found' });
                }
            }

            const updatedRoom = await Room.findByIdAndUpdate(
                roomId,
                updates,
                { new: true }
            ).populate('hotel_id');

            if (!updatedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }

            console.log('Room updated:', updatedRoom);
            res.json(updatedRoom);
        } catch (error) {
            console.error('Error updating room:', error);
            res.status(500).json({ 
                message: 'Error updating room',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    router.delete('/rooms/:id', async (req: Request, res: Response) => {
        try {
            const roomId = req.params.id;
            console.log('Attempting to delete room:', roomId);

            const deletedRoom = await Room.findByIdAndDelete(roomId);
            
            if (!deletedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }

            console.log('Room deleted successfully:', deletedRoom);
            res.status(200).json({ message: 'Room deleted successfully' });
        } catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({ 
                message: 'Error deleting room',
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    });


    // ======================
    // Foglalás útvonalak
    // ======================
    console.log('Configuring routes...'); 
    router.get('/bookings', isAuthenticated, async (req: Request, res: Response) => {
        console.log('GET /bookings route hit');
        try {
            const bookings = await Booking.find({ user_id: (req.user as any)._id })
                .populate('hotel_id', 'name city')
                .populate('room_id', 'price room_type');
            
            console.log('Found bookings for user:', bookings);
            res.status(200).json(bookings);
        } catch (error: any) {
            console.error('Error in /bookings route:', error);
            res.status(500).json({ message: 'Failed to load bookings' });
        }
    });

    router.post('/bookings', isAuthenticated, async (req: Request, res: Response) => {
        try {
            console.log('Received booking request:', req.body);
    
            // 1 - Validate required fields
            if (!req.body.hotel_id || !req.body.room_id || !req.body.check_in || !req.body.check_out || !req.body.total_price) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: ['hotel_id', 'room_id', 'check_in', 'check_out', 'total_price']
                });
            }
    
            // 2 - Check if user already has an active booking
            const existingBooking = await Booking.findOne({
                user_id: (req.user as any)._id,
                status: { $in: ['pending', 'confirmed'] }
            });
    
            if (existingBooking) {
                return res.status(400).json({
                    message: 'You already have an active booking. Please cancel your existing booking before making a new one.'
                });
            }
    
            // 3 - Create and save new booking
            const booking = new Booking({
                ...req.body,
                user_id: (req.user as any)._id,
                status: req.body.status || 'confirmed'  // Use status from request or default to 'confirmed'
            });
    
            const savedBooking = await booking.save();
            console.log('Created booking:', savedBooking);
            
            // Return the populated booking data
            const populatedBooking = await Booking.findById(savedBooking._id)
                .populate('hotel_id', 'name city')
                .populate('room_id', 'room_type price');
    
            res.status(201).json(populatedBooking);
    
        } catch (error: any) {
            console.error('Error creating booking:', error);
            res.status(400).json({
                message: 'Error creating booking',
                error: error.message
            });
        }
    });

    router.patch('/bookings/:id/cancel', isAuthenticated, async (req: Request, res: Response) => {
        try {
            const booking = await Booking.findOne({ 
                _id: req.params.id,
                user_id: (req.user as any)._id 
            });
    
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
    
            if (booking.status === 'cancelled') {
                return res.status(400).json({ message: 'Booking is already cancelled' });
            }
    
            booking.status = 'cancelled';
            await booking.save();
    
            res.status(200).json(booking);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            res.status(500).json({ message: 'Failed to cancel booking' });
        }
    });

    router.get('/bookings/all', isAuthenticated, async (req: Request, res: Response) => {
        console.log('GET /app/bookings/all route hit');
        try {
            const allBookings = await Booking.find()
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
    
            // Transform bookings with null checks
            const transformedBookings = allBookings.map(booking => ({
                _id: booking._id,
                user_id: booking.user_id || null,
                hotel_id: booking.hotel_id || null,
                room_id: booking.room_id || null,
                check_in: booking.check_in,
                check_out: booking.check_out,
                total_price: booking.total_price, // Use total_price instead of price
                status: booking.status
            }));
    
            console.log('Found all bookings:', transformedBookings);
            res.status(200).json(transformedBookings);
        } catch (error: any) {
            console.error('Error in /app/bookings/all route:', error);
            res.status(500).json({ message: 'Failed to load all bookings' });
        }
    });

    // ======================
    // Ajánlat útvonalak
    // ======================
    router.get('/offers', async (req: Request, res: Response) => {
        try {
            const offers = await Offer.find({ is_active: true })
                .populate('hotel_id', 'name amenities');
            res.status(200).send(offers);
        } catch (error) {
            res.status(500).send('Ajánlatok betöltése sikertelen');
        }
    });

    router.post('/offers', isAdmin, async (req: Request, res: Response) => {
        try {
            const offer = new Offer(req.body);
            const savedOffer = await offer.save();
            res.status(201).send(savedOffer);
        } catch (error) {
            res.status(400).send('Érvénytelen ajánlati adatok');
        }
    });

    // ======================
    // Egyéb endpointok törölve (getAllUsers, deleteUser, checkAuth)
    // ======================

    return router;
};
