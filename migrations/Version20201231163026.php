<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201231163026 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE schedule_obs (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, entity_id INT NOT NULL, created_at DATETIME NOT NULL, description LONGTEXT NOT NULL, INDEX IDX_BFC439A6B03A8386 (created_by_id), INDEX IDX_BFC439A681257D5D (entity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE schedule_obs ADD CONSTRAINT FK_BFC439A6B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE schedule_obs ADD CONSTRAINT FK_BFC439A681257D5D FOREIGN KEY (entity_id) REFERENCES schedule (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE schedule_obs');
    }
}
