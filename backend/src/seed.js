require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Specialist = require('./models/Specialist');

async function run() {
  await connectDB();
  const samples = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      qualifications: 'MD, FACC',
      hospital: 'New York Medical Center',
      rating: 4.9,
      reviews: 234,
      consultationFee: 150,
      location: 'New York, NY',
      experienceYears: 15,
      services: {
        videoConsultation: true,
        homeVisit: false,
        insuranceAccepted: true,
        weekendAvailability: true,
        sameDayAppointment: true
      },
      isRecommended: true,
      profileImage: ''
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      qualifications: 'MD, PhD',
      hospital: 'Central Heart Clinic',
      rating: 4.7,
      reviews: 189,
      consultationFee: 180,
      location: 'New York, NY',
      experienceYears: 12,
      services: {
        videoConsultation: true,
        homeVisit: true,
        insuranceAccepted: true,
        weekendAvailability: false,
        sameDayAppointment: true
      },
      isRecommended: false,
      profileImage: ''
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Cardiologist',
      qualifications: 'MD',
      hospital: 'City General Hospital',
      rating: 4.8,
      reviews: 156,
      consultationFee: 130,
      location: 'New York, NY',
      experienceYears: 10,
      services: {
        videoConsultation: false,
        homeVisit: false,
        insuranceAccepted: true,
        weekendAvailability: true,
        sameDayAppointment: false
      },
      isRecommended: false,
      profileImage: ''
    },
    {
      name: 'Dr. A. Smith',
      specialty: 'Cardiologist',
      qualifications: 'MD, FACC',
      hospital: 'City Hospital',
      rating: 4.6,
      reviews: 120,
      consultationFee: 140,
      location: 'New York, NY',
      experienceYears: 8,
      services: {
        videoConsultation: true,
        homeVisit: true,
        insuranceAccepted: true,
        weekendAvailability: true,
        sameDayAppointment: true
      },
      isRecommended: false,
      profileImage: ''
    },
    {
      name: 'Dr. B. Jones',
      specialty: 'Neurologist',
      qualifications: 'MD, PhD',
      hospital: 'Central Clinic',
      rating: 4.5,
      reviews: 98,
      consultationFee: 160,
      location: 'New York, NY',
      experienceYears: 11,
      services: {
        videoConsultation: true,
        homeVisit: false,
        insuranceAccepted: true,
        weekendAvailability: false,
        sameDayAppointment: false
      },
      isRecommended: false,
      profileImage: ''
    },
    {
      name: 'Dr. C. Patel',
      specialty: 'Dentist',
      qualifications: 'DDS',
      hospital: 'Dental Care Center',
      rating: 4.8,
      reviews: 200,
      consultationFee: 100,
      location: 'New York, NY',
      experienceYears: 14,
      services: {
        videoConsultation: false,
        homeVisit: false,
        insuranceAccepted: true,
        weekendAvailability: true,
        sameDayAppointment: true
      },
      isRecommended: false,
      profileImage: ''
    }
  ];
  await Specialist.deleteMany({});
  await Specialist.insertMany(samples);
  console.log(`Seeded ${samples.length} specialists with full data`);
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
