USE [THARWA]
GO
/****** Object:  StoredProcedure [dbo].[get_next_idcommission]    Script Date: 06/05/2018 16:28:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[get_next_idcommission] 
	
AS
SELECT MAX (id)+1  as id FROM Commission

GO
