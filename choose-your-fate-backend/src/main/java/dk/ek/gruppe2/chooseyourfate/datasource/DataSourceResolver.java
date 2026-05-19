package dk.ek.gruppe2.chooseyourfate.datasource;

import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import org.springframework.stereotype.Component;

@Component
public class DataSourceResolver {

    public DataSourceType resolve(String headerValue) {
        if (headerValue == null || headerValue.isBlank()) {
            return DataSourceType.SQL;
        }

        return switch (headerValue.trim().toLowerCase()) {
            case "sql", "mysql" -> DataSourceType.SQL;
            default -> throw new IllegalArgumentException("Unsupported data source: " + headerValue);
        };
    }
}
