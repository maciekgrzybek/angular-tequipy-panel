import { fastify, FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import path from 'path';
import fs from 'fs';

// Define interfaces for our data model
interface Equipment {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  status: 'ACTIVE' | 'OFFBOARDED';
  email: string;
  equipments: Equipment[];
}

interface Address {
  streetLine1: string;
  country: string;
  postalCode: string;
  receiver: string;
}

interface OffboardingRequest {
  id: string;
  employeeId: string;
  address: Address;
  notes: string;
  phone: string;
  email: string;
  timestamp: string;
}

interface OffboardingRequestBody {
  address: Address;
  notes: string;
  phone: string;
  email: string;
}

// Create the server
const server: FastifyInstance = fastify({
  logger: true,
});

// Register CORS
server.register(fastifyCors, {
  origin: true, // Allow all origins
});

// Database path
const dbPath = path.join(__dirname, 'data', 'db.json');

// Helper function to read the database
const readDatabase = (): {
  employees: Employee[];
  offboardingRequests: OffboardingRequest[];
} => {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

// Helper function to write to the database
const writeDatabase = (data: {
  employees: Employee[];
  offboardingRequests: OffboardingRequest[];
}): void => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET /employees - Get all employees
server.get('/employees', async (request, reply) => {
  const db = readDatabase();
  return db.employees;
});

// GET /employees/:id - Get employee by ID
server.get<{
  Params: { id: string };
}>('/employees/:id', async (request, reply) => {
  const { id } = request.params;
  const db = readDatabase();

  const employee = db.employees.find((emp) => emp.id === id);

  if (!employee) {
    reply.code(404).send({ error: 'Employee not found' });
    return;
  }

  return employee;
});

// POST /employees/:id/offboard - Offboard an employee
server.post<{
  Params: { id: string };
  Body: OffboardingRequestBody;
}>('/employees/:id/offboard', async (request, reply) => {
  const { id } = request.params;
  const offboardingData = request.body;

  const db = readDatabase();

  // Find the employee
  const employee = db.employees.find((emp) => emp.id === id);

  if (!employee) {
    reply.code(404).send({ error: 'Employee not found' });
    return;
  }

  // Update employee status
  employee.status = 'OFFBOARDED';

  // Create offboarding request
  const offboardingRequest: OffboardingRequest = {
    id: `off-${Date.now()}`,
    employeeId: id,
    ...offboardingData,
    timestamp: new Date().toISOString(),
  };

  // Add to database
  db.offboardingRequests.push(offboardingRequest);

  // Save changes
  writeDatabase(db);

  // Return the updated employee
  return employee;
});

// Start the server
const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await server.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log(`Fastify server is running on ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
