import java.io.Serializable;
import java.util.Objects;

public class Ward implements Serializable {
    private static final long serialVersionUID = 5L;
    
    private int WardId;
    private String WardName;
    private String description;
    private int capacity;

    public Ward(int WardId, String WardName, String description, int capacity) {
        this.WardId = WardId;
        this.WardName = WardName;
        this.description = description;
        this.capacity = capacity;
    }

    public int getWardId() {
        return WardId;
    }

    public void setWardId(int WardId) {
        this.WardId = WardId;
    }

    public String getWardName() {
        return WardName;
    }

    public void setWardName(String name) {
        this.WardName = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Ward))
            return false;
        Ward ward = (Ward) o;
        return WardId == ward.WardId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(WardId);
    }
}