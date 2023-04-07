
CREATE TABLE IF NOT EXISTS barbers(
  id SERIAL PRIMARY KEY,
  user_name TEXT,
  password TEXT,
  email TEXT UNIQUE NOT NULL,
  device_token TEXT,
  profile_image TEXT ,
  gender TEXT,
  age TEXT ,
  experiance TEXT,
  saloon_longitude FLOAT,
  saloon_latitude FLOAT, 
  block_status TEXT DEFAULT 'inactive',
  saloon_location_address  TEXT ,
  stripe_account_id TEXT ,
  stripe_customer_id  TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers(
  customer_id SERIAL PRIMARY KEY,
  user_name TEXT,
  password TEXT,
  email TEXT UNIQUE NOT NULL,
  device_token TEXT,
  profile_image TEXT ,
  gender TEXT,
  location  POINT , 
  block_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS admins(
  id SERIAL PRIMARY KEY,
  user_name TEXT,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  img  TEXT,
  privacy_policy  TEXT ,
  terms_and_conditions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lengths(
  id SERIAL PRIMARY KEY ,
  name  TEXT ,
  length TEXT 
);

CREATE TABLE IF NOT EXISTS otpStored(
  id SERIAL PRIMARY KEY ,
  email  TEXT ,
  otp TEXT 
);


CREATE TABLE IF NOT EXISTS hairStyles(
  hairStyle_id SERIAL PRIMARY KEY ,
  title  TEXT ,
  image TEXT ,
  created_by TEXT,
  created_by_id INTEGER ,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hairCutPrices(
  hair_cut_price_id SERIAL PRIMARY KEY ,
  price TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commissions(
  commission_id SERIAL PRIMARY KEY ,
  name TEXT,
  percentage TEXT,
  status TEXT DEFAULT 'inactive',
  trash BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cancellation_reasons(
  cancellation_reason_id SERIAL PRIMARY KEY ,
  reason_title TEXT,
  percentage_deduction TEXT,
  trash BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complain_reasons(
  complain_reason_id SERIAL PRIMARY KEY ,
  reason_title TEXT,
  percentage_deduction TEXT,
  trash BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS slot_days(
  slot_day_id SERIAL PRIMARY KEY ,
  name TEXT,
  barber_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS slot_days_timmings(
  slot_day_timmings_id SERIAL PRIMARY KEY ,
  day_id  INTEGER,
  barber_id INTEGER,
  start_time TEXT,
  end_time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS radius(
  radius_id SERIAL PRIMARY KEY ,
  radiusInKm  INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS appointments(
  appointment_id SERIAL PRIMARY KEY ,
  appointment_number  INTEGER,
  length_id INTEGER ,
  style_id INTEGER,
  time_slot TEXT,
  day TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointment_requests(
  appointment_request_id SERIAL PRIMARY KEY ,
  appointment_id INTEGER  ,
  customer_id  INTEGER,
  barber_id INTEGER ,
  status TEXT default 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

