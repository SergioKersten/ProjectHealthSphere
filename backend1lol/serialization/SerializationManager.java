package backend1lol.serialization;

import java.io.*;
import java.util.Set;

public class SerializationManager {

    // Generische Methode zum Speichern von Sets
    public static <T extends Serializable> void saveToFile(Set<T> data, String filename) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename))) {
            oos.writeObject(data);
            System.out.println("Daten erfolgreich in " + filename + " gespeichert.");
        } catch (IOException e) {
            System.err.println("Fehler beim Speichern: " + e.getMessage());
        }
    }

    // Generische Methode zum Laden von Sets
    @SuppressWarnings("unchecked")
    public static <T extends Serializable> Set<T> loadFromFile(String filename) {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filename))) {
            Set<T> data = (Set<T>) ois.readObject();
            System.out.println("Daten erfolgreich aus " + filename + " geladen.");
            return data;
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Fehler beim Laden: " + e.getMessage());
            return null;
        }
    }

    // Methode zum Prüfen ob eine Datei existiert
    public static boolean fileExists(String filename) {
        File file = new File(filename);
        return file.exists() && file.isFile();
    }
}