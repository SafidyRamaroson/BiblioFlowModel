-- ####################################################################
-- # Basic UPDATE statement
-- # See https://www.ibm.com/docs/en/db2-for-zos/13?topic=statements-update for complete syntax.
-- ####################################################################
UPDATE livre
    SET  
    designation = "Science naturelle",
    exemplaire = 30
    WHERE id = "L01";