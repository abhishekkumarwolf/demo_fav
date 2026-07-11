# FavHost - Short-Term Rental Booking & Operations Dashboard

FavHost is a comprehensive property management system (PMS) built to centralize bookings, tasks, guest inquiries, and listing details for short-term rental hosts. 

---

## ─── 🚀 Tech Stack ───────────────────────────────────────────────────

* **Backend:** Django (Python 3)
* **Database:** PostgreSQL (`booking_db`)
* **Frontend:** Vanilla JS, HTML5, CSS3 (using Inter font-family, flex layouts, responsive grid grids, and a modern color system)

---

## ─── 📁 Project Directory Structure ────────────────────────────────────

```text
favhost/
│
├── booking_dashboard/          # Core Django project configuration
│   ├── settings.py             # Database and app settings
│   ├── urls.py                 # Global route declarations
│   └── ...
│
├── properties/                 # Core Django application containing PMS logic
│   ├── management/commands/    # CLI management commands (seed data)
│   ├── migrations/             # Database migration files
│   ├── models.py               # Database schemas and validation
│   ├── urls.py                 # API and Page routes
│   └── views.py                # Main backend logic / JSON response handlers
│
├── static/                     # Static assets (CSS/JS)
│   ├── css/
│   │   └── style.css           # Styling rules, CSS variables, and page grids
│   └── js/
│       ├── app.js              # State manager and sidebar filters
│       ├── calendar.js         # Month/Week timeline layout renderer & modals
│       ├── dashboard.js        # Analytics cards and pending activity loaders
│       ├── inquiries.js        # Inbox messages status manager
│       ├── listings.js         # Listings search/creation & property deletion
│       ├── reservations.js     # Reservations tables and booking forms
│       └── tasks.js            # Operations checklist checkoff logic
│
├── templates/                  # Django HTML templates
│   ├── navbar.html             # Navigation and inquiries badging
│   ├── index.html              # Dashboard home page
│   ├── calendar.html           # Calendar schedule planner
│   ├── reservations.html       # Bookings tables
│   ├── listings.html           # Active listings
│   ├── tasks.html              # Cleaning and maintenance logs
│   └── enquiries.html          # Guest messages inbox
│
├── media/                      # Uploaded files and media uploads
└── manage.py                   # Django CLI entrypoint
```

---

## ─── 🛠️ Core Features ────────────────────────────────────────────────

1. **Analytical Dashboard:**
   * Visualizes core Key Performance Indicators (KPIs) like **Total Properties**, **Active Reservations**, **Total Revenue**, and **Average Nightly Rate**.
   * Lists the most recent reservations and lists pending operations tasks.

2. **Interactive Calendar Schedule (Timeline View):**
   * Toggles between **Month** and **Week** schedule formats.
   * Leverages custom timeline bar placement mapping check-in/out segments.
   * Auto-allocates non-overlapping reservation lanes when multiple bookings overlap on the same property.
   * Incorporates filters for confirmed, pending, cancelled, or checked-out statuses.
   * Clicking a timeline booking displays a detailed reservation modal with action options.

3. **Booking Manager:**
   * Dynamic tabular list of all reservations with search filters and status badges.
   * In-app booking creation validation (automatically flags booking overlap collisions on properties).
   * Booking removal capabilities updating database records instantly.

4. **Listings & Property Inventory:**
   * Displays all active properties with geographic descriptors, maximum guest capacity, and booking counts.
   * Supports properties creation with automated avatar generation if no image URL is provided.
   * Cascade-deletes listings, automatically removing all associated bookings and tasks.

5. **Operational Task Checklist:**
   * Categorizes tasks into **Cleaning**, **Maintenance**, **Inspection**, or **Other**.
   * Interactive checkoffs to toggle tasks between Pending/Done.

6. **Inquiry Inbox Manager:**
   * Centralizes guest inquiries with status labels (New, Replied, Archived).
   * Real-time badges in the navigation bar highlighting active/unreplied inquiries.

---

## ─── 🗄️ Database Schema & Models ──────────────────────────────────────

Defined in [properties/models.py](file:///c:/Users/shado/Desktop/favhost/properties/models.py):

### 1. `Property`
Represents a short-term rental property.
* `name` (CharField) - Unique title of the property listing.
* `description` (TextField) - Property overview text.
* `address`, `city`, `state`, `country` (CharFields) - Location attributes.
* `max_guests` (PositiveSmallIntegerField) - Maximum guest count.
* `property_image` (URLField) - Link to property thumbnail image.

### 2. `Guest`
Stores profiles of guests.
* `first_name`, `last_name` (CharFields) - Guest identifiers.
* `email` (EmailField) - Contact email address.
* `phone` (CharField) - Contact phone number.
* `profile_image` (ImageField) - User avatar image.

### 3. `Reservation`
Represents booking items linking properties and guests.
* `property` (ForeignKey to Property) - Selected listing.
* `guest` (ForeignKey to Guest) - Associated client profile.
* `check_in`, `check_out` (DateFields) - Period limits.
* `status` (CharField) - Choice between `confirmed`, `pending`, `cancelled`, `checked_out`.
* `price_per_night` (DecimalField) - Nightly cost.
* `total_amount` (DecimalField) - Invoice total.
* `source` (CharField) - Airbnb, Booking.com, VRBO, Expedia, Direct, Other.
* `booking_link` (URLField) - External agency link.
* `notes` (TextField) - Host notes.

### 4. `Task`
Operational checklist item.
* `property` (ForeignKey to Property) - Target property.
* `reservation` (ForeignKey to Reservation, nullable) - Connected booking transaction.
* `title` (CharField) - Task header.
* `task_type` (CharField) - Choice of `cleaning`, `maintenance`, `inspection`, `other`.
* `priority` (CharField) - High, Medium, Low.
* `status` (CharField) - Pending, In Progress, Done.
* `assigned_to` (CharField) - Person/team in charge.
* `due_date` (DateField) - Expiration timeline.

### 5. `Inquiry`
Guest inquiry messages.
* `property` (ForeignKey to Property, nullable) - Linked property.
* `guest_name` (CharField) - Sender name.
* `email`, `phone` (CharFields) - Sender details.
* `message` (TextField) - Message body.
* `status` (CharField) - New, Replied, Archived.

---

## ─── 🔌 API Endpoints Reference ───────────────────────────────────────

Detailed list of backend API routes in [properties/views.py](file:///c:/Users/shado/Desktop/favhost/properties/views.py):

| Category | HTTP Method | Endpoint Path | Functionality |
| :--- | :--- | :--- | :--- |
| **Properties** | `GET` | `/api/properties/` | Lists all properties with booking counts. |
| | `POST` | `/api/properties/create/` | Creates a new property listing. |
| | `GET` | `/api/properties/<int:property_id>/` | Retrieves details of a specific property. |
| | `DELETE` | `/api/properties/<int:property_id>/delete/` | Deletes a property (cascades bookings/tasks). |
| | `GET` | `/api/properties/<int:property_id>/reservations/` | Returns reservations for property calendar overlay. |
| **Reservations**| `GET` | `/api/reservations/` | Lists reservations with search & status filters. |
| | `POST` | `/api/reservations/create/` | Registers new booking (checks date overlap collisions). |
| | `GET` | `/api/reservations/<int:reservation_id>/` | Details of a booking including associated tasks. |
| | `PUT/PATCH`| `/api/reservations/<int:reservation_id>/update/` | Updates status, price, nightly rates, or notes. |
| | `DELETE` | `/api/reservations/<int:reservation_id>/delete/` | Deletes a reservation. |
| **Guests** | `GET` | `/api/guests/` | Returns guest lookup index. |
| **Tasks** | `GET` | `/api/tasks/` | Lists operational tasks with type/status filters. |
| | `PUT/PATCH`| `/api/tasks/<int:task_id>/update/` | Updates task status (e.g. checkoff), priority, assignee. |
| **Inquiries** | `GET` | `/api/inquiries/` | Returns inbox inquiries. |
| | `PUT/PATCH`| `/api/inquiries/<int:inquiry_id>/update/` | Updates status (e.g. Mark Replied, Archive). |
| **Dashboard** | `GET` | `/api/dashboard/stats/` | Generates summary KPI counts & recent reservations list. |

---

## ─── ⚙️ Setup & Deployment ───────────────────────────────────────────

### 1. Database Migrations
Generate the schema templates and migrate to the PostgreSQL database:
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 2. Populate Database (Seeding Command)
Populate the database with canonical mock listings, guests, bookings, and operations logs:
```powershell
python manage.py seed --clear
```
*(This command automatically handles sequence resetting in PostgreSQL to ensure subsequent manual creations do not trigger ID collision errors).*

### 3. Start Server
Run the local Django development server:
```powershell
python manage.py runserver
```
Navigate to `http://127.0.0.1:8000/` in your browser.
