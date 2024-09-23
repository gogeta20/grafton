<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240918141008 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE article (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) DEFAULT NULL, description LONGTEXT DEFAULT NULL, price DOUBLE PRECISION NOT NULL, image VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (uuid VARCHAR(255) NOT NULL,name VARCHAR(80) DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(uuid)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $hashedPassword = password_hash('default_password', PASSWORD_BCRYPT); // Usa Bcrypt o el algoritmo que prefieras
        $this->addSql("INSERT INTO user (uuid, name, email, roles, password) VALUES (UUID(), 'mau','develop@example.com', '[\"ROLE_DEVELOPER\"]', '$hashedPassword')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE article');
        $this->addSql('DROP TABLE user');
        $this->addSql("DELETE FROM user WHERE email = 'develop@example.com'");

    }
}
