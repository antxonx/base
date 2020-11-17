<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201117173135 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE error_log ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE error_log ADD CONSTRAINT FK_FCDF27A9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_FCDF27A9A76ED395 ON error_log (user_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE error_log DROP FOREIGN KEY FK_FCDF27A9A76ED395');
        $this->addSql('DROP INDEX IDX_FCDF27A9A76ED395 ON error_log');
        $this->addSql('ALTER TABLE error_log DROP user_id');
    }
}
