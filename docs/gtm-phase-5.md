# Phase 5 - GTM registration and payment events

The application pushes three custom data-layer events through `sendGTMEvent`:

| Customer action | Event | Fired when |
| --- | --- | --- |
| Registration | `generate_lead` | The registration API returns a successful response. |
| PayPal checkout | `begin_checkout` | PayPal returns a valid order ID from the server-created order. |
| Paid registration | `purchase` | The backend captures and verifies a completed ZAR 950 PayPal payment. |

## 1. Create GTM data-layer variables

In Google Tag Manager, open **Variables > New > Data Layer Variable** and create:

- `DLV - program` -> Data Layer Variable Name: `program`
- `DLV - lead_source` -> `lead_source`
- `DLV - value` -> `value`
- `DLV - currency` -> `currency`
- `DLV - transaction_id` -> `transaction_id`
- `DLV - items` -> `items`

Use Data Layer Version 2.

## 2. Create Custom Event triggers

Create these triggers under **Triggers > New > Custom Event**:

- `CE | generate_lead` with event name `generate_lead`
- `CE | begin_checkout` with event name `begin_checkout`
- `CE | purchase` with event name `purchase`

Each trigger should fire on all matching custom events.

## 3. Create GA4 event tags

Create the following Google Analytics event tags using the existing Google tag / GA4 configuration:

### GA4 Event | generate_lead

- Event name: `generate_lead`
- Event parameters:
  - `program`: `{{DLV - program}}`
  - `lead_source`: `{{DLV - lead_source}}`
- Trigger: `CE | generate_lead`

### GA4 Event | begin_checkout

- Event name: `begin_checkout`
- Event parameters:
  - `program`: `{{DLV - program}}`
  - `currency`: `{{DLV - currency}}`
  - `value`: `{{DLV - value}}`
- Trigger: `CE | begin_checkout`

### GA4 Event | purchase

- Event name: `purchase`
- Event parameters:
  - `transaction_id`: `{{DLV - transaction_id}}`
  - `currency`: `{{DLV - currency}}`
  - `value`: `{{DLV - value}}`
  - `items`: `{{DLV - items}}`
- Trigger: `CE | purchase`

Do not create a second hard-coded transaction ID. The PayPal capture ID supplied by the application must be used.

## 4. Create Meta Pixel event tags

Create separate **Custom HTML** tags.

### Meta | Lead

```html
<script>
  fbq("track", "Lead");
</script>
```

Trigger: `CE | generate_lead`

### Meta | InitiateCheckout

```html
<script>
  fbq("track", "InitiateCheckout", {
    value: {{DLV - value}},
    currency: {{DLV - currency}}
  });
</script>
```

Trigger: `CE | begin_checkout`

### Meta | Purchase

```html
<script>
  fbq("track", "Purchase", {
    value: {{DLV - value}},
    currency: {{DLV - currency}}
  });
</script>
```

Trigger: `CE | purchase`

## 5. Mark GA4 key events

After the events have appeared in GA4:

1. Open **Admin**.
2. Open **Events** or **Key events**.
3. Mark `generate_lead` as a key event.
4. Mark `purchase` as a key event.
5. Optionally mark `begin_checkout` if you want it reported as an intermediate conversion.

## 6. Test before publishing

1. Open GTM Preview / Tag Assistant.
2. Submit a valid registration and confirm one `generate_lead` event.
3. Create a PayPal sandbox order and confirm one `begin_checkout` event.
4. Complete the PayPal sandbox payment and confirm one `purchase` event with:
   - `transaction_id`
   - `currency = ZAR`
   - `value = 950`
   - one `items` entry for `ai-business-sprint`
5. Refresh the page and confirm that another `purchase` event is not pushed.
6. Confirm the corresponding GA4 and Meta tags fired on the correct custom events.
7. Publish the GTM container only after the preview tests pass.
