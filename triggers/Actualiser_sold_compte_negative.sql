USE [THARWA]
GO

/****** Object:  Trigger [dbo].[actualiser_compte_]    Script Date: 06/05/2018 16:12:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

create TRIGGER [dbo].[actualiser_compte_] ON [dbo].[Compte]
FOR UPDATE
AS
   
    declare @newBal decimal(19,4);
	declare @oldBal decimal(19,4);
	declare @montant decimal(19,4);
    

    select @newBal=i.Balance from inserted i;  
    select @oldBal=d.Balance from deleted d;


    if (@newBal>@oldBal)and(@oldBal<0)
	 begin
	   if (@newBal>=0)
	     begin 
		  set @montant=-@oldBal;
         end; 
	   else 
	     begin
	      set @montant=@newBal-@oldBal ;
		  end ;
		UPDATE [dbo].[Compte] SET Balance -=@montant WHERE Num='THW000002DZD' ;
		UPDATE [dbo].[Compte] SET Balance +=@montant WHERE Num='THW000001DZD' ;
	end;

GO

ALTER TABLE [dbo].[Compte] ENABLE TRIGGER [actualiser_compte_]
GO

