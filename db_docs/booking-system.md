# Romanoti Solutions – Booking System

## Overview
Romanoti Solutions uses a custom booking page hosted on the website instead of external scheduling tools such as Calendly.

The booking page allows potential clients to request IT consultations directly from the website.

URL:
https://romanoti-solutions.netlify.app/booking.html

## Form Technology
The booking form is implemented using:

- Static HTML
- Netlify Forms backend
- Netlify deployment pipeline

This avoids external dependencies and keeps the system lightweight.

## Form Fields
The form collects the following information:

- Full Name
- Email
- Phone
- Company
- Service Requested
- Preferred Date
- Preferred Time
- Issue Description

## Form Processing
The form uses Netlify form handling.

Flow:

Client  
↓  
Romanoti Website (`booking.html`)  
↓  
Netlify Forms Processing  
↓  
Netlify Dashboard (Form Storage)  
↓  
Email Notification (`info@romanoti-solutions.com`)

This architecture allows Romanoti Solutions to provide consultation booking without relying on third-party scheduling platforms.

## Service Preselection
Homepage buttons pass a query parameter to the booking page.

Examples:

- `/booking.html?service=Free%20Consultation`
- `/booking.html?service=Emergency%20Support`

The booking page reads this parameter and automatically selects the corresponding service in the form.

## Files
Main files involved in the booking system:

- `index.html`
- `booking.html`
- `thank-you.html`
- `db_docs/booking-system.md`

## Deployment
The booking page is deployed through Netlify and accessible at:

- `https://romanoti-solutions.netlify.app/booking.html`

## Future Improvements
Planned enhancements:

- calendar availability integration
- automated confirmation workflows
- internal Romanoti scheduling API
- Ops Console integration
