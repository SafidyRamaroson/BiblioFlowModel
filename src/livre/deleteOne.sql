-- Deleting one book 

-- ####################################################################
-- # Basic DELETE statement
-- # See https://www.ibm.com/docs/en/db2-for-zos/13?topic=statements-delete for complete syntax.
-- ####################################################################
DELETE FROM livre
    WHERE id = "L01";