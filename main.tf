terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.digitalocean_token
}

resource "digitalocean_vpc" "hackmx_vpc" {
  name     = "hackmx-vpc"
  region   = var.region
  ip_range = "10.0.0.0/16"
}

resource "digitalocean_database_cluster" "db" {
  name                  = "hackmx-db-cluster"
  engine                = "pg"
  version               = "13"
  size                  = "db-s-1vcpu-2gb"
  region                = var.region
  node_count            = 1
  private_network_uuid  = digitalocean_vpc.hackmx_vpc.id

  maintenance_window {
    day  = "sunday"
    hour = "02:00:00"
  }
}

resource "digitalocean_database_user" "db_user" {
  cluster_id = digitalocean_database_cluster.db.id
  name       = var.postgres_user
}

resource "digitalocean_database_db" "db" {
  cluster_id = digitalocean_database_cluster.db.id
  name       = var.postgres_db_name
}

resource "digitalocean_droplet" "app" {
  image    = "ubuntu-22-04-x64"
  name     = "app-server"
  region   = var.region
  size     = "s-2vcpu-4gb"
  vpc_uuid = digitalocean_vpc.hackmx_vpc.id

  depends_on = [
    digitalocean_database_cluster.db,
    digitalocean_database_user.db_user,
    digitalocean_database_db.db
  ]

  user_data = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt-get update
    apt-get install -y docker-ce
    usermod -aG docker admin
    docker run -d --name app-server \
      --restart always \
      -p 443:443 \
      -p 80:80 \
      -p ${var.port}:${var.port} \
      -e RUST_LOG=${var.rust_log} \
      -e HOST=${var.host} \
      -e PORT=${var.port} \
      -e DATABASE_URL=postgres://${digitalocean_database_user.db_user.name}:${digitalocean_database_user.db_user.password}@${digitalocean_database_cluster.db.private_host}:${digitalocean_database_cluster.db.port}/${var.postgres_db_name} \
      -e ADMIN_DEFAULT_EMAIL=${var.admin_default_email} \
      -e ADMIN_DEFAULT_PASSWORD=${var.admin_default_password} \
      -e USER_SECRET_KEY=${var.user_secret_key} \
      -e ADMIN_SECRET_KEY=${var.admin_secret_key} \
      -e USER_COOKIE_NAME=${var.user_cookie_name} \
      -e ADMIN_COOKIE_NAME=${var.admin_cookie_name} \
      -e SMTP_HOST=${var.smtp_host} \
      -e SMTP_USERNAME=${var.smtp_username} \
      -e SMTP_PASSWORD=${var.smtp_password} \
      -e SMTP_SENDER="${var.smtp_sender}" \
      zamcv/hackmx:latest
  EOF
}

resource "digitalocean_firewall" "public_firewall" {
  name        = "public-firewall"
  droplet_ids = [digitalocean_droplet.app.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = var.port
    source_addresses = ["0.0.0.0/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0"]
  }

  outbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    destination_addresses = ["0.0.0.0/0"]
  }

  outbound_rule {
    protocol = "icmp"
    destination_addresses = ["0.0.0.0/0"]
  }

  outbound_rule {
    protocol                = "tcp"
    port_range              = "5432"
    destination_addresses   = ["10.0.0.0/16"]
  }
}

output "app_public_ip" {
  value = digitalocean_droplet.app.ipv4_address
}

output "database_private_ip" {
  value = digitalocean_database_cluster.db.private_host
}