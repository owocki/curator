

# **PRD: Curator Studio**

(Working name)

## **Product Summary**

Curator Studio is an on-chain tool that lets trusted stewards (eventually anyone) design, publish, and operate capital allocation strategies by composing funding destinations into transparent, copyable portfolios. It enables curators to direct capital toward public goods or other ecosystem priorities while earning sustainable, protocol-native revenue.

The tool enables funding what matters by creating an competitive, auditable marketplace of funding destinations.  By creating a place to easily discover curated lists of things you can fund.. we make it much easier for ppl to fund what matters to them.

## **Problem**

Public goods funding is fragmented, donation-dependent, and opaque. Meanwhile, DeFi already enables sustainable revenue, but almost entirely for private yield.

There is no shared interface for:

* Designing capital allocation strategies across destinations  
* Making those strategies legible, comparable, and copyable  
* Aligning curator incentives with long-term ecosystem health  
* Tracking the analytics and trends of whos funding what.

## **Target Users**

Primary:

* Curators of funding destinations  
* Funding sources \- stewards of, DAOs, foundations, protocols

Secondary:

* Capital providers (DAOs, protocols, individuals)  
* Mechanism builders seeking distribution  
* Ecosystem coordinators (Gitcoin, EF-adjacent actors)

## **Goals**

* Enable curators to express allocation intent as executable strategies  
* Make allocation decisions transparent and inspectable on-chain  
* Allow capital to follow curators without custody or trust assumptions  
* Support sustainable curator revenue via native protocol flows  
* Preserve credible neutrality through pluralism and competition

## **Non-Goals**

* Custodial fund management  
* Picking winners at the protocol level  
* Off-chain discretionary grantmaking workflows

## **Core User Flows**

1. Curator creates a strategy  
   * Selects a name, and 0x address  
     1. The 0xaddress can be a multisig, EOA, or advanced mechanism: grants, retro PGF, bounties  
   * Sets basic parameters (weights), or eventually advanced parameters like rebalancing rules, governance parameters, or other programmatic logic.  
   * Defines curator fee model where applicable.  
2. Strategy is published  
   * Fully on-chain, permissionless, auditable  
   * Human-readable metadata plus machine-readable config  
3. Capital allocators opt in  
   * Deposit capital into strategy wrapper  
   * Capital flows through underlying mechanisms without curator custody  
4. Strategy executes and accrues outcomes  
   * Funds distributed according to rules  
   * Curator earns defined revenue share where supported  
   * Performance and flows are transparently tracked  
5. Analytics  
   * Leaderboard for top strategies by funding flow $$$, number unique donors.  
   * Trend analysis tools.

## **Key Features**

* Strategy Composer : Visual and contract-level interface to compose allocation baskets  
* Cause/Mechanism Registry: Canonical list of supported funding mechanisms with metadata and risk tags  
* Copy Strategy: One-click replication of curator strategies with optional parameter bounds  
* On-Chain Transparency: Allocation flows, fees, and outcomes visible by default  
* Curator Reputation Layer: Historical performance, longevity, and capital stewarded

## **Success Metrics**

* Capital allocated through curator strategies  
* Number of active curators and published strategies  
* Diversity of mechanisms used per strategy  
* Sustained curator revenue from non-donation sources  
* Repeat capital allocation to top-performing curators

## **Risks and Mitigations**

* Incentive misalignment  
   Mitigation: non-custodial design, transparent fees, reputation tracking  
* Centralization of influence  
   Mitigation: open entry, copyability, pluralism by design  
* Regulatory ambiguity  
   Mitigation: on-chain execution, optional legal wrappers at higher layers

## **Open Questions**

* Default curator fee standards, if any  
* Minimum disclosure requirements for strategies  
* Governance hooks for ecosystem-level oversight  
* Curation of curators.  
* 

