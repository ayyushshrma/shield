# Introduction

Shield is a cloud native role-based authorization-aware reverse-proxy service. With Shield, you can assign roles to users or groups of users to configure policies that determine whether a particular user has the ability to perform a certain action on a given resource.

![](.gitbook/assets/overview.svg)

## Key Features

Here's a list of all the key features of Shield

* **Policy Management**: Policies help you assign various roles to users/groups that determine their access to various resources
* **Group Management**: Group is nothing but another word for the team. Shield provides APIs to add/remove users to/from a group, fetch a list of users in a group along with their roles in the group, and fetch a list of groups a user is a part of.
* **Activity Logs**: Shield has APIs that store and retrieves all the access-related logs. You can see who added/removed a user to/from the group in these logs.
* **Reverse Proxy**: In addition to configuring access management, you can also use Shield as a reverse proxy to directly protect your endpoints by configuring appropriate permissions for them.
* **Google IAP**: Shield also utilizes Google IAP as an authentication mechanism. So if your services are behind a Google IAP, Shield will seamlessly integrate with it.
* **Runtime**: Shield can run inside containers or VMs in a fully managed runtime environment like Kubernetes. Shield also depends on a Postgres server to store data.

## How can I get started?

* [Guides](concepts/architecture.md) provide guidance on how to use Shield and configure it to your needs
* [Concepts](https://github.com/odpf/shield/tree/be9df778d67ff372514d28f74ce33e581d09ca47/docs/concepts/casbin.md) describe the primary concepts and architecture behind Shield
* [Reference](./) contains the list of all the APIs that Shield exposes
* [Contributing](contribute/contribution.md) contains resources for anyone who wants to contribute to Shield

