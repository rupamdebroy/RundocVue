// src/mocks/bookingsData.js
export const bookingsData = [
  {
    bookingId: "RNDOC-DOC-001",
    bookingType: "Doctor Appointment",
    dateTime: "2025-04-14T14:00:00Z",
    status: "Upcoming",
    doctorDetails: {
      doctorName: "Dr. Xyz Abc",
      consultancyFee: 500,
      paymentStatus: "Paid",
    },
    appointmentDetails: {
      appointmentDate: "14th April, 2025 Sunday",
      appointmentTime: "02:00 PM",
      serialNumber: "A-123",
    },
    clinicDetails: {
      clinicName: "A Clinic",
      clinicAddress: "Nayapara, Dharmanagar, Tripura",
    },
    patientDetails: {
      patientName: "Ab Cd",
      gender: "Male",
      age: 53,
    },
    charges: {
      platformFee: 50,
      paymentStatus: "Paid",
    },
    paymentDetails: {
      totalPaid: 550,
      receiptUrl: "https://example.com/receipt/doc001.pdf",
    },
  },
  {
    bookingId: "RNDOC-MED-002",
    bookingType: "Medicine",
    dateTime: "2025-04-14T14:00:00Z",
    status: "Dispatched",
    patientDetails: {
      patientName: "Ab Cd",
      gender: "Male",
      age: 53,
      deliveryAddress: "123 Main St, Dharmanagar, Tripura",
      uploadedCopy: "https://example.com/prescription/med002.pdf",
      note: "Urgent delivery required",
    },
    chemistDetails: {
      chemistName: "A Chemist",
      chemistAddress: "Nayapara, Dharmanagar, Tripura",
    },
    orderDetails: {
      orderType: "Local Delivery",
      orderDate: "14th April, 2025 Sunday",
      orderTime: "02:00 PM",
      status: "Dispatched",
      deliveryAgent: "John Doe",
      deliveryAgentContact: "+91-9876543210",
    },
    charges: {
      platformFee: 0,
      deliveryCharges: 50,
      totalItemValue: 300,
      totalCharges: 350,
    },
    paymentDetails: {
      totalPaid: 350,
      receiptUrl: "https://example.com/receipt/med002.pdf",
    },
  },
  {
    bookingId: "RNDOC-LAB-003",
    bookingType: "Lab Test & Diagnostics",
    dateTime: "2025-04-14T14:00:00Z",
    status: "Successful",
    patientDetails: {
      patientName: "Ab Cd",
      gender: "Male",
      age: 53,
      homeCollectionAddress: "123 Main St, Dharmanagar, Tripura",
      uploadedCopy: "https://example.com/prescription/lab003.pdf",
      note: "Fasting required",
    },
    labDetails: {
      clinicName: "A Clinic",
      clinicAddress: "Nayapara, Dharmanagar, Tripura",
    },
    appointmentDetails: {
      appointmentDate: "14th April, 2025 Sunday",
      appointmentTime: "02:00 PM",
      homeCollection: "Yes",
      sampleCollector: "Jane Smith",
    },
    testDetails: {
      reportAvailable: true,
      reportUrl: "https://example.com/report/lab003.pdf",
    },
    charges: {
      platformFee: 0,
      testCharges: 1000,
      diagnosticCharges: 500,
      homeCollectionCharges: "Free",
      totalCharges: 1500,
    },
    paymentDetails: {
      totalPaid: 1500,
      receiptUrl: "https://example.com/receipt/lab003.pdf",
    },
  },
  {
    bookingId: "RNDOC-AMB-004",
    bookingType: "Ambulance",
    dateTime: "2025-04-14T14:00:00Z",
    status: "Successful",
    patientDetails: {
      patientName: "Ab Cd",
      gender: "Male",
      age: 53,
      pickupAddress: "123 Main St, Dharmanagar, Tripura",
      destinationAddress: "City Hospital, Tripura",
      note: "Emergency case",
    },
    bookingDetails: {
      bookingDate: "14th April, 2025 Sunday",
      bookingTime: "02:00 PM",
    },
    ambulanceDetails: {
      vehicleNumber: "TR-01-AB-1234",
      driverName: "Mike Johnson",
      contactNumber: "+91-9876543210",
    },
    charges: {
      platformFee: 0,
      ambulanceCharges: 2000,
    },
    paymentDetails: {
      totalPaid: 2000,
      receiptUrl: "https://example.com/receipt/amb004.pdf",
    },
  },
];
