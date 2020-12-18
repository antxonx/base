<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201218223437 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE schedule ADD assigned_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE schedule ADD CONSTRAINT FK_5A3811FBE1501A05 FOREIGN KEY (assigned_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_5A3811FBE1501A05 ON schedule (assigned_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE schedule DROP FOREIGN KEY FK_5A3811FBE1501A05');
        $this->addSql('DROP INDEX IDX_5A3811FBE1501A05 ON schedule');
        $this->addSql('ALTER TABLE schedule DROP assigned_id');
    }
}
