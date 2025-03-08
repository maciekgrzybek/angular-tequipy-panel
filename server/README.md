# Tequipy Server

A simple TypeScript server using json-server to store employee information and equipment data.

## API Endpoints

### Employees

- `GET /employees` - Get all employees
- `GET /employees/:id` - Get a specific employee by ID
- `POST /employees` - Create a new employee
- `PUT /employees/:id` - Update an employee
- `DELETE /employees/:id` - Delete an employee

### Custom Endpoints

- `POST /employees/:id/offboard` - Offboard an employee

  Request body:
  ```json
  {
    "address": {
      "streetLine1": "Kocmyrzowska 1",
      "country": "Poland",
      "postalCode": "13-231",
      "receiver": "Stefan Batory"
    },
    "notes": "some text",
    "phone": "+48123123123",
    "email": "some.email@gmail.com"
  }
  ```

## Development

### Installation

```bash
npm install
```

### Running the server

```bash
# Development mode with hot reloading
npm run dev

# Build and run in production mode
npm run build
npm start
```

## Integration with Angular

This server is designed to work alongside the Angular Tequipy Panel application. You can run both the server and the Angular app concurrently using:

```bash
# From the root directory of the project
npm run dev
```

## Note

This server stores data in memory and in a local JSON file. Data will persist between server restarts but will be reset if the `db.json` file is modified directly. 