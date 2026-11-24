---
title: "Dame Más Gasolina"
subtitle: "Product · Web app"
description: "Is filling up in Spain worth the drive? Finds the cheapest full tank near you in Portugal and over the border, counting the fuel to get there and back. Live prices from both governments, toll-free routes, a straight answer."
technologies: ["Astro", "Node.js", "Google Maps Platform"]
services: ["apps"]
featured: true
# NÍTIDA's own product, grouped with Godwit (-2) ahead of CINCA (-1);
# a fraction so nothing else needs renumbering.
order: -1.5
image: "/media/damemasgasolina.webp"
backgroundPosition: "0% 0%"
link: ["https://damemasgasolina.app/", "Visit"]
---

# Dame Más Gasolina - PT vs ES fuel prices

A free web app, built and run by NÍTIDA, that tells a driver in mainland Portugal whether crossing into Spain to fill up actually saves money once the round trip is counted.

## Scope

- PT (DGEG) and ES (MITECO) price feeds, refreshed every 30 minutes
- Ranking by total cost: full tank plus the round-trip fuel, with the driver's own tank and consumption
- Toll-free routes from the Google Routes API, cached per area to keep API costs down
- Map with numbered pins, a share button and an installable PWA
