<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200902234448 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact ADD created_by_id INT NOT NULL, ADD updated_by_id INT NOT NULL, ADD created_at DATETIME NOT NULL, ADD updated_at DATETIME NOT NULL, ADD suspended TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E638B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E638896DBBDE FOREIGN KEY (updated_by_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_4C62E638B03A8386 ON contact (created_by_id)');
        $this->addSql('CREATE INDEX IDX_4C62E638896DBBDE ON contact (updated_by_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E638B03A8386');
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E638896DBBDE');
        $this->addSql('DROP INDEX IDX_4C62E638B03A8386 ON contact');
        $this->addSql('DROP INDEX IDX_4C62E638896DBBDE ON contact');
        $this->addSql('ALTER TABLE contact DROP created_by_id, DROP updated_by_id, DROP created_at, DROP updated_at, DROP suspended');
    }
}
