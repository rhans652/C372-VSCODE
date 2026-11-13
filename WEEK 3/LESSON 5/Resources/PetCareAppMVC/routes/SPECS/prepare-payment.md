# Feature: Prepare payment details

## 1. User goal
Allow a pet owner to review the selected pet service and its amount before payment.

## 2. Scope
- Prepare and return payment details for a service in the mock catalogue.
- The server's mock catalogue is the source of truth for service names and prices.
- Do not accept or use a payment amount supplied by the client.
- This endpoint does not charge money, create a transaction, or connect to a payment gateway.
- Login is not required for this classroom mock endpoint.
- Do not add database tables or EJS pages for this feature.

## 3. Request
- **Method:** `GET`
- **URL:** `/payments/prepare/:serviceId`
- **Input:** `serviceId` is the service ID in the URL path. The client does not supply an amount.

## 4. Service catalogue
| Service ID | Service name | Price |
|---:|---|---:|
| 1 | Vaccination | 35 |
| 2 | Pet Grooming | 50 |
| 3 | Boarding | 80 |

Prices are in SGD and must be looked up by the server from this mock catalogue.

## 5. Successful response
For a known service, return HTTP `200` with a JSON object containing exactly these five fields:

| Field | Type | Required value |
|---|---|---|
| `serviceId` | number | The requested catalogue ID |
| `serviceName` | string | The catalogue service name |
| `amount` | number | The catalogue price |
| `currency` | string | Exactly `"sgd"` |
| `status` | string | Exactly `"READY_FOR_PAYMENT"` |

Example response for service ID 1:

```json
{
  "serviceId": 1,
  "serviceName": "Vaccination",
  "amount": 35,
  "currency": "sgd",
  "status": "READY_FOR_PAYMENT"
}
```

Do not include additional fields in the successful response.

## 6. Unsuccessful response
If the requested service ID is not in the catalogue, return HTTP `404` with:

```json
{
  "error": "Service not found"
}
```

## 7. Acceptance criteria
- **AC1:** Requesting `/payments/prepare/1` returns HTTP `200` with service name `Vaccination` and amount `35`.
- **AC2:** Requesting `/payments/prepare/2` returns HTTP `200` with service name `Pet Grooming` and amount `50`.
- **AC3:** Requesting `/payments/prepare/3` returns HTTP `200` with service name `Boarding` and amount `80`.
- **AC4:** Requesting `/payments/prepare/999` returns HTTP `404` with `{"error":"Service not found"}`.
- **AC5:** Every successful response contains exactly five fields; `serviceId` and `amount` are numbers; the other fields are strings; `currency` is exactly `"sgd"`; and `status` is exactly `"READY_FOR_PAYMENT"`.

## 8. Open questions
- The behavior for a missing, malformed, or non-numeric `serviceId` has not been specified. Agree on it before implementing behavior for those cases.
