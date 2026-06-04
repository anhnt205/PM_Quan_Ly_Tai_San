 drop table if exists lylich_nhomtaisan;
 alter table nhomtaisan
 add column IdLyLich varchar(255),
 ADD CONSTRAINT fk_IdLyLich_constraint
 FOREIGN KEY (IdLyLich)
 REFERENCES lylich(id);