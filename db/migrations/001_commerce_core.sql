CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  customer_email VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL,
  payment_status VARCHAR(32) NOT NULL,
  payment_intent_id VARCHAR(128) NULL,
  checkout_session_id VARCHAR(128) NULL,
  transfer_group VARCHAR(128) NOT NULL,
  currency CHAR(3) NOT NULL,
  subtotal_amount INT NOT NULL DEFAULT 0,
  shipping_amount INT NOT NULL DEFAULT 0,
  total_amount INT NOT NULL DEFAULT 0,
  platform_fee_amount INT NOT NULL DEFAULT 0,
  raw_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY idx_orders_payment_intent (payment_intent_id),
  UNIQUE KEY idx_orders_checkout_session (checkout_session_id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(96) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(128) NOT NULL,
  variant_id VARCHAR(128) NOT NULL,
  brand VARCHAR(32) NOT NULL,
  source VARCHAR(32) NOT NULL,
  fulfillment_provider VARCHAR(32) NOT NULL,
  quantity INT NOT NULL,
  unit_amount INT NOT NULL,
  gross_amount INT NOT NULL,
  shipping_amount INT NOT NULL DEFAULT 0,
  platform_fee_amount INT NOT NULL,
  net_amount INT NOT NULL,
  transfer_status VARCHAR(32) NOT NULL,
  refund_status VARCHAR(32) NOT NULL,
  provider_mapping_id VARCHAR(96) NULL,
  provider_order_id VARCHAR(128) NULL,
  raw_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id VARCHAR(96) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  order_item_id VARCHAR(96) NULL,
  brand VARCHAR(32) NOT NULL,
  entry_type VARCHAR(64) NOT NULL,
  amount INT NOT NULL,
  currency CHAR(3) NOT NULL,
  reference VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ledger_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id VARCHAR(128) PRIMARY KEY,
  provider VARCHAR(32) NOT NULL,
  event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(128) NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  payload_json JSON NOT NULL,
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME NULL,
  processing_status VARCHAR(32) NOT NULL,
  error_message TEXT NULL,
  idempotency_key VARCHAR(255) NOT NULL,
  UNIQUE KEY uniq_webhook_provider_event (provider, event_id),
  UNIQUE KEY uniq_webhook_idempotency (idempotency_key)
);

CREATE TABLE IF NOT EXISTS stripe_transfers (
  id VARCHAR(96) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  brand VARCHAR(32) NOT NULL,
  stripe_transfer_id VARCHAR(128) NULL,
  destination_account VARCHAR(128) NULL,
  amount INT NOT NULL,
  currency CHAR(3) NOT NULL,
  status VARCHAR(32) NOT NULL,
  attempt_count INT NOT NULL DEFAULT 0,
  failure_reason TEXT NULL,
  idempotency_key VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_stripe_transfer_idempotency (idempotency_key),
  CONSTRAINT fk_stripe_transfers_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS provider_product_mappings (
  id VARCHAR(96) PRIMARY KEY,
  brand VARCHAR(32) NOT NULL,
  internal_product_id VARCHAR(128) NOT NULL,
  provider VARCHAR(32) NOT NULL,
  provider_product_id VARCHAR(255) NOT NULL,
  provider_variant_id VARCHAR(255) NULL,
  provider_shop_id VARCHAR(255) NULL,
  provider_region VARCHAR(32) NOT NULL,
  currency CHAR(3) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_provider_product_mapping (brand, internal_product_id, provider, provider_region)
);

CREATE TABLE IF NOT EXISTS provider_variant_mappings (
  id VARCHAR(96) PRIMARY KEY,
  product_mapping_id VARCHAR(96) NOT NULL,
  internal_product_id VARCHAR(128) NOT NULL,
  internal_variant_id VARCHAR(128) NOT NULL,
  provider VARCHAR(32) NOT NULL,
  provider_product_id VARCHAR(255) NOT NULL,
  provider_variant_id VARCHAR(255) NOT NULL,
  sku VARCHAR(128) NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_provider_variant_mapping (internal_product_id, internal_variant_id, provider, provider_variant_id),
  CONSTRAINT fk_provider_variant_product FOREIGN KEY (product_mapping_id) REFERENCES provider_product_mappings(id)
);

CREATE TABLE IF NOT EXISTS provider_orders (
  id VARCHAR(96) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  provider VARCHAR(32) NOT NULL,
  provider_order_id VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL,
  tracking_json JSON NULL,
  raw_response_json JSON NULL,
  idempotency_key VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_provider_order_idempotency (idempotency_key),
  CONSTRAINT fk_provider_orders_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS provider_order_events (
  id VARCHAR(96) PRIMARY KEY,
  provider_order_id VARCHAR(96) NOT NULL,
  provider VARCHAR(32) NOT NULL,
  event_type VARCHAR(128) NOT NULL,
  payload_json JSON NOT NULL,
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_provider_order_events_order FOREIGN KEY (provider_order_id) REFERENCES provider_orders(id)
);

CREATE TABLE IF NOT EXISTS fulfillment_attempts (
  id VARCHAR(96) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  order_item_id VARCHAR(96) NULL,
  provider VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  attempt_count INT NOT NULL DEFAULT 1,
  idempotency_key VARCHAR(255) NOT NULL,
  error_message TEXT NULL,
  raw_request_json JSON NULL,
  raw_response_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_fulfillment_attempt_idempotency (idempotency_key),
  CONSTRAINT fk_fulfillment_attempts_order FOREIGN KEY (order_id) REFERENCES orders(id)
);
