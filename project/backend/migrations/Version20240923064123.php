<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240923064123 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE favorites DROP FOREIGN KEY FK_E46960F57294869C');
        $this->addSql('ALTER TABLE favorites ADD CONSTRAINT FK_E46960F57294869C FOREIGN KEY (article_id) REFERENCES article (uuid) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE favorites DROP FOREIGN KEY FK_E46960F57294869C');
        $this->addSql('ALTER TABLE favorites ADD CONSTRAINT FK_E46960F57294869C FOREIGN KEY (article_id) REFERENCES article (uuid) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
