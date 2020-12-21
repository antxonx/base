<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201218194642 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE schedule ADD category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE schedule ADD CONSTRAINT FK_5A3811FB12469DE2 FOREIGN KEY (category_id) REFERENCES schedule_category (id)');
        $this->addSql('CREATE INDEX IDX_5A3811FB12469DE2 ON schedule (category_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE schedule DROP FOREIGN KEY FK_5A3811FB12469DE2');
        $this->addSql('DROP INDEX IDX_5A3811FB12469DE2 ON schedule');
        $this->addSql('ALTER TABLE schedule DROP category_id');
    }
}
