<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220708135214 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE categoria_publicacion (id INT AUTO_INCREMENT NOT NULL, nombre_categoria VARCHAR(20) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE publicacion (id INT AUTO_INCREMENT NOT NULL, categoria_id INT NOT NULL, user_id INT DEFAULT NULL, id_comprador_id INT DEFAULT NULL, titulo VARCHAR(130) NOT NULL, descripcion VARCHAR(600) NOT NULL, ubicacion VARCHAR(100) NOT NULL, puntuacion VARCHAR(15) NOT NULL, path VARCHAR(60) NOT NULL, fecha_publicacion DATETIME NOT NULL, cant_votantes VARCHAR(25) NOT NULL, precio VARCHAR(10) DEFAULT NULL, estado_publicacion TINYINT(1) NOT NULL, INDEX IDX_62F2085F3397707A (categoria_id), INDEX IDX_62F2085FA76ED395 (user_id), INDEX IDX_62F2085F3CB2B57 (id_comprador_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, nombre VARCHAR(20) NOT NULL, apellido VARCHAR(25) NOT NULL, fecha_nacimiento DATE NOT NULL, pais VARCHAR(20) NOT NULL, UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE publicacion ADD CONSTRAINT FK_62F2085F3397707A FOREIGN KEY (categoria_id) REFERENCES categoria_publicacion (id)');
        $this->addSql('ALTER TABLE publicacion ADD CONSTRAINT FK_62F2085FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE publicacion ADD CONSTRAINT FK_62F2085F3CB2B57 FOREIGN KEY (id_comprador_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE publicacion DROP FOREIGN KEY FK_62F2085F3397707A');
        $this->addSql('ALTER TABLE publicacion DROP FOREIGN KEY FK_62F2085FA76ED395');
        $this->addSql('ALTER TABLE publicacion DROP FOREIGN KEY FK_62F2085F3CB2B57');
        $this->addSql('DROP TABLE categoria_publicacion');
        $this->addSql('DROP TABLE publicacion');
        $this->addSql('DROP TABLE user');
    }
}
