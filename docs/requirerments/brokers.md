# Trucking Brokers
A trucking broker is a company that arranges transportation for shippers and carriers. They can be either a broker-only company or a broker-carrier company.

## Entities and Relationships

### Carriers
- A carrier is a company that owns or leases trucks and employs drivers to transport goods.
- A broker can have multiple carriers

### Factors
- A factor is a company that provides financing for carriers to purchase trucks and equipment.
- A broker can have multiple factors

### Shippers
- A shipper is a company that needs to transport goods.
- A broker can have multiple shippers

### Loads
- A load is a shipment request from a shipper to a broker

## Workflow
1. A broker creates a load
2. A broker searches for carriers that can fulfill the load
   1. A broker can search for carriers by name
   2. A broker negotiates the load details with the selected carrier
   3. A broker confirms the shipment details with the carrier
3. A broker notifies the shipper that the load has been assigned to a carrier
4. The load is now in progress
5. The load is completed
6. The load is invoiced
7. The load is paid