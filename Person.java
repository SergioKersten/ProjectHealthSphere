import java.time.LocalDate;


class Person {
   long id;
   String name;
   String vorname;
   String telefonnummer;
   String email;


   public Person(long id, String name, String vorname, String telefonnummer, String email) {
       this.id = id;
       this.name = name;
       this.vorname = vorname;
       this.telefonnummer = telefonnummer;
       this.email = email;
   }
}


class Patient extends Person {
   private static long nextId = 1;
   private LocalDate geburtsdatum;
   private String adresse;


   public Patient(String name, String vorname, String telefonnummer, String email, LocalDate geburtsdatum,
           String adresse) {
       super(nextId++, name, vorname, telefonnummer, email);
       this.geburtsdatum = geburtsdatum;
       this.adresse = adresse;
   }


   public String getAdresse() {
       return adresse;
   }


   public long getPatientId() {
       return id;
   }
}


class Mitarbeiter extends Person {
   String fachbereich;


   public Mitarbeiter(long id, String name, String vorname, String telefonnummer, String email, String fachbereich) {
       super(id, name, vorname, telefonnummer, email);
       this.fachbereich = fachbereich;
   }


}

