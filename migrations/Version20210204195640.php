<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210204195640 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE schedule_recurrent (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, updated_by_id INT NOT NULL, category_id INT DEFAULT NULL, assigned_id INT DEFAULT NULL, priority_id INT DEFAULT NULL, client_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, detail LONGTEXT NOT NULL, INDEX IDX_2ECEC427B03A8386 (created_by_id), INDEX IDX_2ECEC427896DBBDE (updated_by_id), INDEX IDX_2ECEC42712469DE2 (category_id), INDEX IDX_2ECEC427E1501A05 (assigned_id), INDEX IDX_2ECEC427497B19F9 (priority_id), INDEX IDX_2ECEC42719EB6921 (client_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE schedule_recurrent_obs (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, entity_id INT NOT NULL, created_at DATETIME NOT NULL, description LONGTEXT NOT NULL, INDEX IDX_4D8A3B42B03A8386 (created_by_id), INDEX IDX_4D8A3B4281257D5D (entity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE schedule_recurrent ADD CONSTRAINT FK_2ECEC427B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE schedule_recurrent ADD CONSTRAINT FK_2ECEC427896DBBDE FOREIGN KEY (updated_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE schedule_recurrent ADD CONSTRAINT FK_2ECEC42712469DE2 FOREIGN KEY (category_id) REFERENCES schedule_category (id)');
        $this->addSql('ALTER TABLE schedule_recurrent ADD CONSTRAINT FK_2ECEC427E1501A05 FOREIGN KEY (assigned_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE schedule_recurrent ADD CONSTRAINT FK_2ECEC427497B19F9 FOREIGN KEY (priority_id) REFERENCES schedule_priority (id)');
        $this->addSql('ALTER TABLE schedule_recurrent ADD CONSTRAINT FK_2ECEC42719EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE schedule_recurrent_obs ADD CONSTRAINT FK_4D8A3B42B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE schedule_recurrent_obs ADD CONSTRAINT FK_4D8A3B4281257D5D FOREIGN KEY (entity_id) REFERENCES schedule_recurrent (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE schedule_recurrent_obs DROP FOREIGN KEY FK_4D8A3B4281257D5D');
        $this->addSql('DROP TABLE schedule_recurrent');
        $this->addSql('DROP TABLE schedule_recurrent_obs');
    }
}
