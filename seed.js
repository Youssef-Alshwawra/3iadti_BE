import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Generate ObjectIds for references
const userIds = Array.from({ length: 30 }, () => new mongoose.Types.ObjectId());
const patientIds = Array.from({ length: 20 }, () => new mongoose.Types.ObjectId());
const doctorIds = Array.from({ length: 5 }, () => new mongoose.Types.ObjectId());
const appointmentIds = Array.from({ length: 10 }, () => new mongoose.Types.ObjectId());
const specialtyIds = Array.from({ length: 8 }, () => new mongoose.Types.ObjectId());

// Helper function to generate random date
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Users data (30 users: 20 patients, 5 doctors, 5 admins)
export const users = [
    // Patients (20)
    ...Array.from({ length: 20 }, (_, i) => ({
        _id: userIds[i],
        email: `patient${i + 1}@example.com`,
        password: bcrypt.hashSync('password123', 10),
        name: [
            'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'James Wilson',
            'Mary Martinez', 'Robert Anderson', 'Lisa Taylor', 'David Thomas', 'Jennifer Jackson',
            'William White', 'Maria Harris', 'Richard Martin', 'Elizabeth Thompson', 'Joseph Garcia',
            'Patricia Rodriguez', 'Christopher Lewis', 'Nancy Walker', 'Daniel Hall', 'Karen Allen'
        ][i],
        phone: `+1${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
        role: 'patient',
        isEmailVerified: true,
        emailVerificationOTP: null,
        emailVerificationOTPExpires: null,
        passwordResetOTP: null,
        passwordResetOTPExpires: null,
        lastLogin: randomDate(new Date(2024, 0, 1), new Date()),
        createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
        updatedAt: new Date()
    })),
    // Doctors (5)
    ...Array.from({ length: 5 }, (_, i) => ({
        _id: userIds[20 + i],
        email: `doctor${i + 1}@example.com`,
        password: bcrypt.hashSync('password123', 10),
        name: ['Dr. Amanda Chen', 'Dr. Mark Johnson', 'Dr. Rachel Green', 'Dr. Steve Williams', 'Dr. Nina Patel'][i],
        phone: `+1${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
        role: 'doctor',
        isEmailVerified: true,
        emailVerificationOTP: null,
        emailVerificationOTPExpires: null,
        passwordResetOTP: null,
        passwordResetOTPExpires: null,
        lastLogin: randomDate(new Date(2024, 0, 1), new Date()),
        createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
        updatedAt: new Date()
    })),
    // Admins (5)
    ...Array.from({ length: 5 }, (_, i) => ({
        _id: userIds[25 + i],
        email: `admin${i + 1}@example.com`,
        password: bcrypt.hashSync('admin123', 10),
        name: ['Admin Alex', 'Admin Blake', 'Admin Charlie', 'Admin Diana', 'Admin Eve'][i],
        phone: `+1${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
        role: 'admin',
        isEmailVerified: true,
        emailVerificationOTP: null,
        emailVerificationOTPExpires: null,
        passwordResetOTP: null,
        passwordResetOTPExpires: null,
        lastLogin: randomDate(new Date(2024, 0, 1), new Date()),
        createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
        updatedAt: new Date()
    }))
];

// Specialties data (8)
export const specialties = [
    {
        _id: specialtyIds[0],
        name: 'Cardiology',
        description: 'Heart and blood vessel disorders',
        icon: 'heart-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: specialtyIds[1],
        name: 'Dermatology',
        description: 'Skin, hair, and nail conditions',
        icon: 'skin-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: specialtyIds[2],
        name: 'Pediatrics',
        description: 'Medical care for infants, children, and adolescents',
        icon: 'child-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: specialtyIds[3],
        name: 'Orthopedics',
        description: 'Musculoskeletal system disorders',
        icon: 'bone-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: specialtyIds[4],
        name: 'Psychiatry',
        description: 'Mental health and behavioral disorders',
        icon: 'brain-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: specialtyIds[5],
        name: 'Ophthalmology',
        description: 'Eye and vision care',
        icon: 'eye-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: specialtyIds[6],
        name: 'General Practice',
        description: 'Primary healthcare and routine checkups',
        icon: 'stethoscope-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: specialtyIds[7],
        name: 'Neurology',
        description: 'Nervous system disorders',
        icon: 'neuron-icon.svg',
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    }
];

// Patients data (20)
export const patients = Array.from({ length: 20 }, (_, i) => ({
    _id: patientIds[i],
    userId: userIds[i],
    address: [
        '123 Main St, New York, NY 10001',
        '456 Oak Ave, Los Angeles, CA 90001',
        '789 Pine Rd, Chicago, IL 60601',
        '321 Elm St, Houston, TX 77001',
        '654 Maple Dr, Phoenix, AZ 85001',
        '987 Cedar Ln, Philadelphia, PA 19101',
        '147 Birch Way, San Antonio, TX 78201',
        '258 Spruce Ct, San Diego, CA 92101',
        '369 Willow Pl, Dallas, TX 75201',
        '741 Ash Blvd, San Jose, CA 95101',
        '852 Cherry St, Austin, TX 78701',
        '963 Walnut Ave, Jacksonville, FL 32201',
        '159 Hickory Rd, Fort Worth, TX 76101',
        '357 Sycamore Dr, Columbus, OH 43201',
        '486 Poplar Ln, Charlotte, NC 28201',
        '624 Beech Way, Detroit, MI 48201',
        '738 Fir Ct, El Paso, TX 79901',
        '842 Cypress Pl, Memphis, TN 38101',
        '951 Magnolia Blvd, Boston, MA 02101',
        '267 Redwood St, Seattle, WA 98101'
    ][i],
    dateOfBirth: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
    updatedAt: new Date()
}));

// Doctors data (5)
export const doctors = [
    {
        _id: doctorIds[0],
        userId: userIds[20],
        specialty: 'Cardiology',
        location: 'New York, NY',
        fee: 250,
        photo: '/uploads/doctors/dr-chen.jpg',
        clinic: {
            name: 'HeartCare Medical Center',
            address: '100 Park Ave, New York, NY 10017',
            phone: '+1-212-555-0100',
            description: 'Specialized cardiac care with state-of-the-art facilities',
            images: ['/uploads/clinics/heartcare1.jpg', '/uploads/clinics/heartcare2.jpg'],
            status: 'approved',
            submittedAt: new Date(2024, 0, 15),
            reviewedBy: userIds[25],
            reviewedAt: new Date(2024, 0, 16),
            rejectionReason: null
        },
        createdAt: new Date(2024, 0, 20),
        updatedAt: new Date()
    },
    {
        _id: doctorIds[1],
        userId: userIds[21],
        specialty: 'Dermatology',
        location: 'Los Angeles, CA',
        fee: 200,
        photo: '/uploads/doctors/dr-johnson.jpg',
        clinic: {
            name: 'SkinHealth Clinic',
            address: '500 Sunset Blvd, Los Angeles, CA 90028',
            phone: '+1-310-555-0200',
            description: 'Expert dermatological treatments and cosmetic procedures',
            images: ['/uploads/clinics/skinhealth1.jpg'],
            status: 'approved',
            submittedAt: new Date(2024, 0, 18),
            reviewedBy: userIds[26],
            reviewedAt: new Date(2024, 0, 19),
            rejectionReason: null
        },
        createdAt: new Date(2024, 0, 22),
        updatedAt: new Date()
    },
    {
        _id: doctorIds[2],
        userId: userIds[22],
        specialty: 'Pediatrics',
        location: 'Chicago, IL',
        fee: 180,
        photo: '/uploads/doctors/dr-green.jpg',
        clinic: {
            name: 'Kids First Pediatric Center',
            address: '200 Michigan Ave, Chicago, IL 60601',
            phone: '+1-312-555-0300',
            description: 'Comprehensive pediatric care in a child-friendly environment',
            images: ['/uploads/clinics/kidsfirst1.jpg', '/uploads/clinics/kidsfirst2.jpg', '/uploads/clinics/kidsfirst3.jpg'],
            status: 'approved',
            submittedAt: new Date(2024, 1, 1),
            reviewedBy: userIds[27],
            reviewedAt: new Date(2024, 1, 2),
            rejectionReason: null
        },
        createdAt: new Date(2024, 1, 5),
        updatedAt: new Date()
    },
    {
        _id: doctorIds[3],
        userId: userIds[23],
        specialty: 'Orthopedics',
        location: 'Houston, TX',
        fee: 300,
        photo: '/uploads/doctors/dr-williams.jpg',
        clinic: {
            name: 'OrthoExcel Sports Medicine',
            address: '1500 Medical Center Dr, Houston, TX 77030',
            phone: '+1-713-555-0400',
            description: 'Advanced orthopedic and sports medicine treatments',
            images: ['/uploads/clinics/orthoexcel1.jpg', '/uploads/clinics/orthoexcel2.jpg'],
            status: 'pending',
            submittedAt: new Date(2024, 2, 1),
            reviewedBy: null,
            reviewedAt: null,
            rejectionReason: null
        },
        createdAt: new Date(2024, 1, 10),
        updatedAt: new Date()
    },
    {
        _id: doctorIds[4],
        userId: userIds[24],
        specialty: 'General Practice',
        location: 'Phoenix, AZ',
        fee: 150,
        photo: '/uploads/doctors/dr-patel.jpg',
        clinic: {
            name: 'Family Health Associates',
            address: '800 Camelback Rd, Phoenix, AZ 85013',
            phone: '+1-602-555-0500',
            description: 'Comprehensive family medicine and preventive care',
            images: ['/uploads/clinics/familyhealth1.jpg'],
            status: 'rejected',
            submittedAt: new Date(2024, 1, 15),
            reviewedBy: userIds[28],
            reviewedAt: new Date(2024, 1, 17),
            rejectionReason: 'Incomplete documentation provided'
        },
        createdAt: new Date(2024, 1, 20),
        updatedAt: new Date()
    }
];

// Appointments data (10)
export const appointments = [
    {
        _id: appointmentIds[0],
        patientId: patientIds[0],
        doctorId: doctorIds[0],
        appointmentDate: new Date(2024, 11, 15, 10, 0),
        timeSlot: '10:00 AM - 10:30 AM',
        status: 'completed',
        amount: 250,
        createdAt: new Date(2024, 11, 1),
        updatedAt: new Date(2024, 11, 15)
    },
    {
        _id: appointmentIds[1],
        patientId: patientIds[1],
        doctorId: doctorIds[1],
        appointmentDate: new Date(2024, 11, 20, 14, 30),
        timeSlot: '2:30 PM - 3:00 PM',
        status: 'completed',
        amount: 200,
        createdAt: new Date(2024, 11, 5),
        updatedAt: new Date(2024, 11, 20)
    },
    {
        _id: appointmentIds[2],
        patientId: patientIds[2],
        doctorId: doctorIds[2],
        appointmentDate: new Date(2025, 0, 10, 9, 0),
        timeSlot: '9:00 AM - 9:30 AM',
        status: 'confirmed',
        amount: 180,
        createdAt: new Date(2024, 11, 28),
        updatedAt: new Date(2024, 11, 29)
    },
    {
        _id: appointmentIds[3],
        patientId: patientIds[3],
        doctorId: doctorIds[3],
        appointmentDate: new Date(2025, 0, 12, 15, 0),
        timeSlot: '3:00 PM - 3:30 PM',
        status: 'confirmed',
        amount: 300,
        createdAt: new Date(2024, 11, 30),
        updatedAt: new Date(2025, 0, 2)
    },
    {
        _id: appointmentIds[4],
        patientId: patientIds[4],
        doctorId: doctorIds[4],
        appointmentDate: new Date(2025, 0, 15, 11, 30),
        timeSlot: '11:30 AM - 12:00 PM',
        status: 'pending',
        amount: 150,
        createdAt: new Date(2025, 0, 5),
        updatedAt: new Date(2025, 0, 5)
    },
    {
        _id: appointmentIds[5],
        patientId: patientIds[5],
        doctorId: doctorIds[0],
        appointmentDate: new Date(2024, 10, 25, 16, 0),
        timeSlot: '4:00 PM - 4:30 PM',
        status: 'cancelled',
        amount: 250,
        createdAt: new Date(2024, 10, 15),
        updatedAt: new Date(2024, 10, 23)
    },
    {
        _id: appointmentIds[6],
        patientId: patientIds[6],
        doctorId: doctorIds[1],
        appointmentDate: new Date(2025, 0, 18, 10, 30),
        timeSlot: '10:30 AM - 11:00 AM',
        status: 'pending',
        amount: 200,
        createdAt: new Date(2025, 0, 8),
        updatedAt: new Date(2025, 0, 8)
    },
    {
        _id: appointmentIds[7],
        patientId: patientIds[7],
        doctorId: doctorIds[2],
        appointmentDate: new Date(2024, 11, 10, 13, 0),
        timeSlot: '1:00 PM - 1:30 PM',
        status: 'completed',
        amount: 180,
        createdAt: new Date(2024, 10, 28),
        updatedAt: new Date(2024, 11, 10)
    },
    {
        _id: appointmentIds[8],
        patientId: patientIds[0],
        doctorId: doctorIds[3],
        appointmentDate: new Date(2025, 0, 20, 14, 0),
        timeSlot: '2:00 PM - 2:30 PM',
        status: 'confirmed',
        amount: 300,
        createdAt: new Date(2025, 0, 10),
        updatedAt: new Date(2025, 0, 11)
    },
    {
        _id: appointmentIds[9],
        patientId: patientIds[1],
        doctorId: doctorIds[4],
        appointmentDate: new Date(2025, 0, 22, 9, 30),
        timeSlot: '9:30 AM - 10:00 AM',
        status: 'pending',
        amount: 150,
        createdAt: new Date(2025, 0, 12),
        updatedAt: new Date(2025, 0, 12)
    }
];

// Medical Records data (12)
export const medicalRecords = [
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[0],
        appointmentId: appointmentIds[0],
        diagnosis: 'Mild hypertension detected. Blood pressure: 140/90 mmHg',
        prescription: 'Amlodipine 5mg once daily. Lifestyle modifications recommended.',
        visitDate: new Date(2024, 11, 15),
        createdAt: new Date(2024, 11, 15),
        updatedAt: new Date(2024, 11, 15)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[1],
        appointmentId: appointmentIds[1],
        diagnosis: 'Atopic dermatitis on forearms and neck',
        prescription: 'Hydrocortisone cream 2.5% twice daily. Cetirizine 10mg for itching.',
        visitDate: new Date(2024, 11, 20),
        createdAt: new Date(2024, 11, 20),
        updatedAt: new Date(2024, 11, 20)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[7],
        appointmentId: appointmentIds[7],
        diagnosis: 'Upper respiratory tract infection',
        prescription: 'Amoxicillin 500mg three times daily for 7 days. Rest and fluids.',
        visitDate: new Date(2024, 11, 10),
        createdAt: new Date(2024, 11, 10),
        updatedAt: new Date(2024, 11, 10)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[0],
        appointmentId: appointmentIds[0],
        diagnosis: 'Follow-up: Blood pressure improved to 130/85 mmHg',
        prescription: 'Continue current medication. Review in 3 months.',
        visitDate: new Date(2024, 11, 15),
        createdAt: new Date(2024, 11, 15),
        updatedAt: new Date(2024, 11, 15)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[1],
        appointmentId: appointmentIds[1],
        diagnosis: 'Skin condition improving. Mild dryness remains.',
        prescription: 'Continue moisturizer. Reduce steroid cream to once daily.',
        visitDate: new Date(2024, 11, 20),
        createdAt: new Date(2024, 11, 20),
        updatedAt: new Date(2024, 11, 20)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[2],
        appointmentId: appointmentIds[2],
        diagnosis: 'Routine pediatric checkup - all parameters normal',
        prescription: 'Vitamin D supplements recommended. Schedule next visit in 6 months.',
        visitDate: new Date(2025, 0, 10),
        createdAt: new Date(2025, 0, 10),
        updatedAt: new Date(2025, 0, 10)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[3],
        appointmentId: appointmentIds[3],
        diagnosis: 'Chronic lower back pain - lumbar strain',
        prescription: 'Ibuprofen 400mg as needed. Physical therapy recommended.',
        visitDate: new Date(2025, 0, 12),
        createdAt: new Date(2025, 0, 12),
        updatedAt: new Date(2025, 0, 12)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[4],
        appointmentId: appointmentIds[4],
        diagnosis: 'Annual health screening - cholesterol slightly elevated',
        prescription: 'Dietary modifications. Statin therapy if no improvement in 3 months.',
        visitDate: new Date(2025, 0, 15),
        createdAt: new Date(2025, 0, 15),
        updatedAt: new Date(2025, 0, 15)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[7],
        appointmentId: appointmentIds[7],
        diagnosis: 'Recovery from URI complete. No complications.',
        prescription: 'No medication needed. Maintain good hygiene practices.',
        visitDate: new Date(2024, 11, 10),
        createdAt: new Date(2024, 11, 10),
        updatedAt: new Date(2024, 11, 10)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[0],
        appointmentId: appointmentIds[8],
        diagnosis: 'Knee pain evaluation - minor osteoarthritis',
        prescription: 'Glucosamine supplements. Low-impact exercises recommended.',
        visitDate: new Date(2025, 0, 20),
        createdAt: new Date(2025, 0, 20),
        updatedAt: new Date(2025, 0, 20)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[1],
        appointmentId: appointmentIds[9],
        diagnosis: 'Preventive care visit - all systems normal',
        prescription: 'Continue healthy lifestyle. Annual flu vaccine recommended.',
        visitDate: new Date(2025, 0, 22),
        createdAt: new Date(2025, 0, 22),
        updatedAt: new Date(2025, 0, 22)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[5],
        appointmentId: appointmentIds[5],
        diagnosis: 'Initial consultation cancelled - rescheduled',
        prescription: 'N/A',
        visitDate: new Date(2024, 10, 25),
        createdAt: new Date(2024, 10, 25),
        updatedAt: new Date(2024, 10, 25)
    }
];

// Payments data (10 - one for each appointment)
export const payments = appointments.map((appointment, index) => ({
    _id: new mongoose.Types.ObjectId(),
    appointmentId: appointment._id,
    amount: appointment.amount,
    paymentMethod: ['cash', 'card_at_clinic', 'bank_transfer'][index % 3],
    status: appointment.status === 'completed' ? 'completed' :
        appointment.status === 'cancelled' ? 'refunded' :
            appointment.status === 'confirmed' ? 'completed' : 'pending',
    paymentDate: appointment.status === 'completed' || appointment.status === 'confirmed' ?
        appointment.appointmentDate : null,
    refundReason: appointment.status === 'cancelled' ? 'Appointment cancelled by patient' : null,
    refundDate: appointment.status === 'cancelled' ?
        new Date(appointment.updatedAt.getTime() + 86400000) : null,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt
}));

// Reports data (3)
export const reports = [
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[0],
        appointmentId: appointmentIds[0],
        reportType: 'Blood Test Results',
        description: 'Complete blood count and lipid profile',
        fileUrl: '/uploads/reports/patient1_blood_test_2024.pdf',
        uploadedBy: doctorIds[0],
        uploadDate: new Date(2024, 11, 16),
        createdAt: new Date(2024, 11, 16),
        updatedAt: new Date(2024, 11, 16)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[3],
        appointmentId: appointmentIds[3],
        reportType: 'X-Ray Report',
        description: 'Lumbar spine X-ray showing mild degenerative changes',
        fileUrl: '/uploads/reports/patient4_xray_lumbar_2025.pdf',
        uploadedBy: doctorIds[3],
        uploadDate: new Date(2025, 0, 13),
        createdAt: new Date(2025, 0, 13),
        updatedAt: new Date(2025, 0, 13)
    },
    {
        _id: new mongoose.Types.ObjectId(),
        patientId: patientIds[1],
        appointmentId: appointmentIds[1],
        reportType: 'Allergy Test',
        description: 'Comprehensive allergy panel results',
        fileUrl: '/uploads/reports/patient2_allergy_test_2024.pdf',
        uploadedBy: doctorIds[1],
        uploadDate: new Date(2024, 11, 21),
        createdAt: new Date(2024, 11, 21),
        updatedAt: new Date(2024, 11, 21)
    }
];

// Schedules data (5 - one for each doctor)
export const schedules = [
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[0],
        dayOfWeek: 1, // Monday
        slots: [
            { startTime: '09:00', endTime: '09:30', isAvailable: true },
            { startTime: '09:30', endTime: '10:00', isAvailable: true },
            { startTime: '10:00', endTime: '10:30', isAvailable: false },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: true },
            { startTime: '14:00', endTime: '14:30', isAvailable: true },
            { startTime: '14:30', endTime: '15:00', isAvailable: true },
            { startTime: '15:00', endTime: '15:30', isAvailable: true },
            { startTime: '15:30', endTime: '16:00', isAvailable: false },
            { startTime: '16:00', endTime: '16:30', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[0],
        dayOfWeek: 3, // Wednesday
        slots: [
            { startTime: '09:00', endTime: '09:30', isAvailable: true },
            { startTime: '09:30', endTime: '10:00', isAvailable: true },
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: false },
            { startTime: '11:00', endTime: '11:30', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[1],
        dayOfWeek: 2, // Tuesday
        slots: [
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: true },
            { startTime: '11:30', endTime: '12:00', isAvailable: false },
            { startTime: '14:00', endTime: '14:30', isAvailable: true },
            { startTime: '14:30', endTime: '15:00', isAvailable: true },
            { startTime: '15:00', endTime: '15:30', isAvailable: true },
            { startTime: '15:30', endTime: '16:00', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[1],
        dayOfWeek: 4, // Thursday
        slots: [
            { startTime: '09:00', endTime: '09:30', isAvailable: true },
            { startTime: '09:30', endTime: '10:00', isAvailable: false },
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: true },
            { startTime: '11:30', endTime: '12:00', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[2],
        dayOfWeek: 1, // Monday
        slots: [
            { startTime: '08:00', endTime: '08:30', isAvailable: true },
            { startTime: '08:30', endTime: '09:00', isAvailable: true },
            { startTime: '09:00', endTime: '09:30', isAvailable: false },
            { startTime: '09:30', endTime: '10:00', isAvailable: true },
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: false },
            { startTime: '13:00', endTime: '13:30', isAvailable: true },
            { startTime: '13:30', endTime: '14:00', isAvailable: true },
            { startTime: '14:00', endTime: '14:30', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[2],
        dayOfWeek: 3, // Wednesday
        slots: [
            { startTime: '08:00', endTime: '08:30', isAvailable: true },
            { startTime: '08:30', endTime: '09:00', isAvailable: true },
            { startTime: '09:00', endTime: '09:30', isAvailable: true },
            { startTime: '09:30', endTime: '10:00', isAvailable: false },
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[2],
        dayOfWeek: 5, // Friday
        slots: [
            { startTime: '08:00', endTime: '08:30', isAvailable: true },
            { startTime: '08:30', endTime: '09:00', isAvailable: true },
            { startTime: '09:00', endTime: '09:30', isAvailable: true },
            { startTime: '09:30', endTime: '10:00', isAvailable: true },
            { startTime: '10:00', endTime: '10:30', isAvailable: false },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[3],
        dayOfWeek: 2, // Tuesday
        slots: [
            { startTime: '11:00', endTime: '11:30', isAvailable: true },
            { startTime: '11:30', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '14:30', isAvailable: true },
            { startTime: '14:30', endTime: '15:00', isAvailable: false },
            { startTime: '15:00', endTime: '15:30', isAvailable: true },
            { startTime: '15:30', endTime: '16:00', isAvailable: true },
            { startTime: '16:00', endTime: '16:30', isAvailable: true },
            { startTime: '16:30', endTime: '17:00', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[3],
        dayOfWeek: 4, // Thursday
        slots: [
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: false },
            { startTime: '11:30', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '14:30', isAvailable: true },
            { startTime: '14:30', endTime: '15:00', isAvailable: true },
            { startTime: '15:00', endTime: '15:30', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[4],
        dayOfWeek: 1, // Monday
        slots: [
            { startTime: '09:00', endTime: '09:30', isAvailable: true },
            { startTime: '09:30', endTime: '10:00', isAvailable: false },
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: true },
            { startTime: '11:30', endTime: '12:00', isAvailable: true },
            { startTime: '13:00', endTime: '13:30', isAvailable: true },
            { startTime: '13:30', endTime: '14:00', isAvailable: true },
            { startTime: '14:00', endTime: '14:30', isAvailable: false },
            { startTime: '14:30', endTime: '15:00', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[4],
        dayOfWeek: 3, // Wednesday
        slots: [
            { startTime: '09:00', endTime: '09:30', isAvailable: true },
            { startTime: '09:30', endTime: '10:00', isAvailable: true },
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: false },
            { startTime: '11:00', endTime: '11:30', isAvailable: true },
            { startTime: '11:30', endTime: '12:00', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    },
    {
        _id: new mongoose.Types.ObjectId(),
        doctorId: doctorIds[4],
        dayOfWeek: 5, // Friday
        slots: [
            { startTime: '09:00', endTime: '09:30', isAvailable: false },
            { startTime: '09:30', endTime: '10:00', isAvailable: true },
            { startTime: '10:00', endTime: '10:30', isAvailable: true },
            { startTime: '10:30', endTime: '11:00', isAvailable: true },
            { startTime: '11:00', endTime: '11:30', isAvailable: true },
            { startTime: '11:30', endTime: '12:00', isAvailable: false },
            { startTime: '13:00', endTime: '13:30', isAvailable: true },
            { startTime: '13:30', endTime: '14:00', isAvailable: true }
        ],
        isAvailable: true,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date()
    }
];

// Seeding function
export const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Import your models
        const User = (await import('./src/models/User.js')).default;
        const Patient = (await import('./src/models/Patient.js')).default;
        const Doctor = (await import('./src/models/Doctor.js')).default;
        const Specialty = (await import('./src/models/Specialty.js')).default;
        const Appointment = (await import('./src/models/Appointment.js')).default;
        const MedicalRecord = (await import('./src/models/MedicalRecord.js')).default;
        const Payment = (await import('./src/models/Payment.js')).default;
        const Report = (await import('./src/models/Report.js')).default;
        const Schedule = (await import('./src/models/Schedule.js')).default;

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        await Specialty.deleteMany({});
        await Appointment.deleteMany({});
        await MedicalRecord.deleteMany({});
        await Payment.deleteMany({});
        await Report.deleteMany({});
        await Schedule.deleteMany({});

        // Insert new data
        console.log('👤 Creating users...');
        await User.insertMany(users);

        console.log('🎯 Creating specialties...');
        await Specialty.insertMany(specialties);

        console.log('🤒 Creating patients...');
        await Patient.insertMany(patients);

        console.log('👨‍⚕️ Creating doctors...');
        await Doctor.insertMany(doctors);

        console.log('📅 Creating appointments...');
        await Appointment.insertMany(appointments);

        console.log('📋 Creating medical records...');
        await MedicalRecord.insertMany(medicalRecords);

        console.log('💳 Creating payments...');
        await Payment.insertMany(payments);

        console.log('📄 Creating reports...');
        await Report.insertMany(reports);

        console.log('🗓️ Creating schedules...');
        await Schedule.insertMany(schedules);

        console.log('✅ Database seeding completed successfully!');
        console.log(`
        📊 Summary:
        - Users: ${users.length} (${users.filter(u => u.role === 'patient').length} patients, ${users.filter(u => u.role === 'doctor').length} doctors, ${users.filter(u => u.role === 'admin').length} admins)
        - Specialties: ${specialties.length}
        - Patients: ${patients.length}
        - Doctors: ${doctors.length}
        - Appointments: ${appointments.length}
        - Medical Records: ${medicalRecords.length}
        - Payments: ${payments.length}
        - Reports: ${reports.length}
        - Schedules: ${schedules.length}
        `);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

// Connect to MongoDB and run seeder
export const runSeeder = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/3iadti', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('📦 Connected to MongoDB');

        // Run the seeding function
        await seedDatabase();

        // Close the connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');

        process.exit(0);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}