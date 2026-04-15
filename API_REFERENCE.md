# VietFlood API Endpoint Reference Guide

**Last Updated**: April 15, 2026  
**API Version**: v1  
**Base URL**: `${EXPO_PUBLIC_API_BASE_URL}`  

## Table of Contents
1. [Authentication](#authentication)
2. [Reports](#reports)
3. [Operations](#operations)
4. [Users](#users)
5. [Sync](#sync)
6. [Error Handling](#error-handling)

---

## Authentication

### Login
**Endpoint**: `POST /auth/login`

**Request**:
```typescript
{
  email: string;
  password: string;
}
```

**Response**: 
```typescript
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'citizen' | 'relief_worker' | 'admin';
  };
}
```

**Status Codes**:
- `200` - Login successful
- `401` - Invalid credentials
- `400` - Missing required fields

---

### Register
**Endpoint**: `POST /auth/register`

**Request**:
```typescript
{
  email: string;
  password: string;
  name: string;
  phone?: string;
}
```

**Response**:
```typescript
{
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

**Status Codes**:
- `201` - Registration successful
- `409` - Email already registered
- `400` - Validation error

---

### Refresh Token
**Endpoint**: `POST /auth/refresh`

**Request**:
```typescript
{
  refreshToken: string;
}
```

**Response**:
```typescript
{
  accessToken: string;
  expiresIn: number;
}
```

**Status Codes**:
- `200` - Token refreshed
- `401` - Invalid refresh token

---

### Logout
**Endpoint**: `POST /auth/logout`

**Authentication**: Bearer Token Required

**Response**: `{ success: true }`

**Status Codes**:
- `200` - Logout successful
- `401` - Unauthorized

---

## Reports

### List Reports
**Endpoint**: `GET /reports`

**Authentication**: Bearer Token Required

**Query Parameters**:
```typescript
{
  skip?: number;           // Pagination offset (default: 0)
  limit?: number;          // Items per page (default: 20, max: 100)
  status?: string;         // Filter by status
  type?: string;           // Filter by report type
  since?: string;          // ISO 8601 timestamp for sync
}
```

**Response**:
```typescript
{
  data: Report[];
  total: number;
  skip: number;
  limit: number;
}
```

**Report Model**:
```typescript
{
  id: string;
  type: 'flood_damage' | 'water_supply' | 'infrastructure' | 'health' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos: Array<{
    url: string;
    caption?: string;
  }>;
  status: 'pending' | 'verified' | 'resolved';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### Get Report by ID
**Endpoint**: `GET /reports/{id}`

**Authentication**: Bearer Token Required

**Response**: `Report`

**Status Codes**:
- `200` - Success
- `404` - Report not found
- `401` - Unauthorized

---

### Create Report
**Endpoint**: `POST /reports`

**Authentication**: Bearer Token Required

**Request**:
```typescript
{
  type: string;
  title: string;
  description: string;
  severity: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos?: Array<{
    uri: string;
    name: string;
    type: string;
  }>;
}
```

**Response**: `Report` (with server-generated ID and timestamps)

**Status Codes**:
- `201` - Report created
- `400` - Validation error
- `401` - Unauthorized

---

### Update Report
**Endpoint**: `PATCH /reports/{id}`

**Authentication**: Bearer Token Required

**Request**: Partial `Report` object (only fields to update)

**Response**: Updated `Report`

**Status Codes**:
- `200` - Updated
- `404` - Report not found
- `401` - Unauthorized
- `403` - Not report owner

---

### Delete Report
**Endpoint**: `DELETE /reports/{id}`

**Authentication**: Bearer Token Required

**Response**: `{ success: true }`

**Status Codes**:
- `200` - Deleted
- `404` - Report not found
- `401` - Unauthorized
- `403` - Not report owner

---

### Sync Reports
**Endpoint**: `GET /reports/sync`

**Authentication**: Bearer Token Required

**Query Parameters**:
```typescript
{
  since?: string;  // ISO 8601 timestamp - return only reports modified after this
}
```

**Response**: `Report[]` (reports modified since timestamp)

**Status Codes**:
- `200` - Success
- `400` - Invalid timestamp format
- `401` - Unauthorized

---

## Operations

### List Operations
**Endpoint**: `GET /operations`

**Authentication**: Bearer Token Required (relief_worker or admin)

**Query Parameters**:
```typescript
{
  skip?: number;
  limit?: number;
  status?: string;
  since?: string;
}
```

**Response**:
```typescript
{
  data: ReliefOperation[];
  total: number;
}
```

**ReliefOperation Model**:
```typescript
{
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'planning' | 'active' | 'completed' | 'suspended';
  priority: 'low' | 'medium' | 'high' | 'critical';
  coordinator: {
    id: string;
    name: string;
    contact: string;
  };
  volunteers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

**Status Codes**:
- `200` - Success
- `403` - Insufficient permissions

---

### Get Operation by ID
**Endpoint**: `GET /operations/{id}`

**Authentication**: Bearer Token Required (relief_worker or admin)

**Response**: `ReliefOperation`

**Status Codes**:
- `200` - Success
- `404` - Operation not found
- `403` - Insufficient permissions

---

### Create Operation
**Endpoint**: `POST /operations`

**Authentication**: Bearer Token Required (admin only)

**Request**:
```typescript
{
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  priority: string;
}
```

**Response**: `ReliefOperation`

**Status Codes**:
- `201` - Created
- `400` - Validation error
- `403` - Insufficient permissions

---

### Update Operation
**Endpoint**: `PATCH /operations/{id}`

**Authentication**: Bearer Token Required (relief_worker or admin)

**Request**: Partial `ReliefOperation` object

**Response**: Updated `ReliefOperation`

**Status Codes**:
- `200` - Updated
- `404` - Not found
- `403` - Insufficient permissions

---

### Update Operation Status
**Endpoint**: `PATCH /operations/{id}`

**Authentication**: Bearer Token Required (relief_worker or admin)

**Request**:
```typescript
{
  status: 'planning' | 'active' | 'completed' | 'suspended';
}
```

**Response**: Updated `ReliefOperation`

**Status Codes**:
- `200` - Updated
- `404` - Not found
- `403` - Insufficient permissions

---

### Sync Operations
**Endpoint**: `GET /operations/sync`

**Authentication**: Bearer Token Required (relief_worker or admin)

**Query Parameters**:
```typescript
{
  since?: string;  // ISO 8601 timestamp
}
```

**Response**: `ReliefOperation[]`

**Status Codes**:
- `200` - Success
- `400` - Invalid timestamp

---

## Users

### Get Current User
**Endpoint**: `GET /users/me`

**Authentication**: Bearer Token Required

**Response**:
```typescript
{
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'citizen' | 'relief_worker' | 'admin';
  avatar?: string;
  createdAt: string;
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized

---

### Update Profile
**Endpoint**: `PATCH /users/me`

**Authentication**: Bearer Token Required

**Request**:
```typescript
{
  name?: string;
  phone?: string;
  avatar?: string;
}
```

**Response**: Updated user object

**Status Codes**:
- `200` - Updated
- `400` - Validation error
- `401` - Unauthorized

---

## Sync

### Batch Sync
**Endpoint**: `POST /sync/batch`

**Authentication**: Bearer Token Required

**Request**:
```typescript
{
  requests: Array<{
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    path: string;
    body?: any;
  }>;
}
```

**Response**:
```typescript
{
  results: Array<{
    status: number;
    data?: any;
    error?: string;
  }>;
}
```

**Status Codes**:
- `200` - Request processed (check individual result statuses)
- `400` - Invalid request format
- `401` - Unauthorized

**Example**:
```typescript
POST /sync/batch
{
  "requests": [
    {
      "method": "POST",
      "path": "/reports",
      "body": { "title": "Flood Report", ... }
    },
    {
      "method": "PATCH",
      "path": "/operations/op123",
      "body": { "status": "active" }
    }
  ]
}
```

---

## Error Handling

### Error Response Format
All errors follow this format:

```typescript
{
  error: string;           // Human-readable error message
  code: string;            // Machine-readable error code
  statusCode: number;      // HTTP status code
  details?: {              // Additional context
    field?: string;
    message?: string;
  };
  timestamp: string;       // ISO 8601 timestamp
}
```

### Common Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, etc. |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Backend error |
| 503 | Service Unavailable | Maintenance |

### Error Codes

```
AUTH_INVALID_CREDENTIALS = "Invalid email or password"
AUTH_TOKEN_EXPIRED = "Access token expired"
AUTH_TOKEN_INVALID = "Invalid token"
AUTH_INSUFFICIENT_PERMISSIONS = "Insufficient permissions"
VALIDATION_ERROR = "Validation failed"
RESOURCE_NOT_FOUND = "Resource not found"
RESOURCE_CONFLICT = "Resource conflicts with existing"
RATE_LIMIT_EXCEEDED = "Too many requests"
SERVER_ERROR = "Internal server error"
```

---

## Authentication Header

All authenticated requests must include:

```
Authorization: Bearer <accessToken>
```

**Token Placement**:
```typescript
fetch(`${API_URL}/reports`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
})
```

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per user
- **Response**: Includes `X-RateLimit-*` headers
- **Status**: 429 Too Many Requests when exceeded
- **Backoff**: Exponential retry with jitter recommended

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1713177000
```

---

## Pagination

List endpoints support pagination:

```typescript
// Request next page
GET /reports?skip=20&limit=20

// Response includes:
{
  data: [...],
  total: 500,        // Total items available
  skip: 20,          // Current offset
  limit: 20,         // Items per page
}
```

---

## Timestamps

All timestamps are in ISO 8601 format:

```
2026-04-15T12:30:45Z
```

For sync queries, use:

```
GET /reports/sync?since=2026-04-15T12:00:00Z
```

---

## Implementation Notes

### Client Usage Example

```typescript
import { apiClient } from '@/lib/api-client';

// Create report
const report = await apiClient.post('/reports', {
  type: 'flood_damage',
  title: 'Flood at Market Street',
  // ...
});

// List reports with sync
const reports = await apiClient.get('/reports/sync', {
  since: new Date(Date.now() - 3600000).toISOString(),
});

// Batch sync multiple operations
const results = await apiClient.post('/sync/batch', {
  requests: [
    { method: 'POST', path: '/reports', body: {...} },
    { method: 'PATCH', path: '/operations/123', body: {...} },
  ]
});
```

### Offline Usage

For offline-first functionality:

```typescript
// Uses apiClient with automatic caching
import { offlineReportService } from '@/lib/offline-services';

// Will cache result and queue request if offline
const report = await offlineReportService.createReport(data);
```

---

## Versioning & Deprecation

**Current Version**: v1  
**Deprecated Endpoints**: None  
**Sunset Policy**: 6-month notice before deprecation  

For API changes, check:
- Changelog (TODO: add link)
- Migration guide (TODO: add link)

---

## Support & Documentation

- **Postman Collection**: [Link to collection] (TODO)
- **GraphQL Alternative**: Not available (REST only)
- **WebSocket Support**: Not available (polling/batch sync only)
- **SDK Repository**: [Link to SDK] (TODO)

**Last Updated**: April 15, 2026  
**Next Review**: May 15, 2026
