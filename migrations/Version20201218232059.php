<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201218232059 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE schedule ADD priority_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE schedule ADD CONSTRAINT FK_5A3811FB497B19F9 FOREIGN KEY (priority_id) REFERENCES schedule_priority (id)');
        $this->addSql('CREATE INDEX IDX_5A3811FB497B19F9 ON schedule (priority_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE schedule DROP FOREIGN KEY FK_5A3811FB497B19F9');
        $this->addSql('DROP INDEX IDX_5A3811FB497B19F9 ON schedule');
        $this->addSql('ALTER TABLE schedule DROP priority_id');
    }
}
