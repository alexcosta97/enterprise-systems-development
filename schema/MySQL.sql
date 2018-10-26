-- Exported from QuickDBD: https://www.quickdatatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- https://app.quickdatabasediagrams.com
-- Relations
-- -     - one TO one
-- -<    - one TO many
-- >-    - many TO one
-- >-<   - many TO many
-- -0    - one TO zero or one
-- 0-    - zero or one TO one
-- 0-0   - zero or one TO zero or one
-- -0<   - one TO zero or many
-- >0-   - zero or many TO one

CREATE TABLE `User` (
    `userID` int  NOT NULL ,
    `name` string  NOT NULL ,
    `username` string  NOT NULL ,
    `password` string  NOT NULL ,
    `role` int  NOT NULL DEFAULT 0,
    PRIMARY KEY (
        `userID`
    ),
    CONSTRAINT `uc_User_username` UNIQUE (
        `username`
    )
);

CREATE TABLE `PropertyAgent` (
    `propertyAgentID` int  NOT NULL ,
    `userID` int  NOT NULL ,
    `propertyID` int  NOT NULL ,
    PRIMARY KEY (
        `propertyAgentID`
    )
);

-- Address
-- -
-- addressID int PK
-- country string
-- county string
-- streetName string
-- houseNumber string
-- postCode string
CREATE TABLE `Property` (
    `propertyID` int  NOT NULL ,
    -- addressID int FK - Address.addressID
    `country` string  NOT NULL ,
    `county` string  NOT NULL ,
    `streetName` string  NOT NULL ,
    `houseNumber` string  NOT NULL ,
    `postCode` string  NOT NULL ,
    'description' string,
    PRIMARY KEY (
        `propertyID`
    )
);

CREATE TABLE `Floor` (
    `floorID` int  NOT NULL ,
    `propertyID` int  NOT NULL ,
    `level` string  NOT NULL ,
    PRIMARY KEY (
        `floorID`
    )
);

CREATE TABLE `Room` (
    `roomID` int  NOT NULL ,
    `floorID` int  NOT NULL ,
    `pixelsX` double  NOT NULL ,
    `pixelsY` double  NOT NULL ,
    PRIMARY KEY (
        `roomID`
    )
);

CREATE TABLE `360Picture` (
    `360PictureID` int  NOT NULL ,
    `roomID` int  NOT NULL ,
    `imageURL` string  NOT NULL ,
    PRIMARY KEY (
        `360PictureID`
    )
);

ALTER TABLE `PropertyAgent` ADD CONSTRAINT `fk_PropertyAgent_userID` FOREIGN KEY(`userID`)
REFERENCES `User` (`userID`);

ALTER TABLE `PropertyAgent` ADD CONSTRAINT `fk_PropertyAgent_propertyID` FOREIGN KEY(`propertyID`)
REFERENCES `Property` (`propertyID`);

ALTER TABLE `Floor` ADD CONSTRAINT `fk_Floor_propertyID` FOREIGN KEY(`propertyID`)
REFERENCES `Property` (`propertyID`);

ALTER TABLE `Room` ADD CONSTRAINT `fk_Room_floorID` FOREIGN KEY(`floorID`)
REFERENCES `Floor` (`floorID`);

ALTER TABLE `360Picture` ADD CONSTRAINT `fk_360Picture_roomID` FOREIGN KEY(`roomID`)
REFERENCES `Room` (`roomID`);

