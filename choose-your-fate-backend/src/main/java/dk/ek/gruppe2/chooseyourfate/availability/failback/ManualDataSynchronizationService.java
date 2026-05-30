package dk.ek.gruppe2.chooseyourfate.availability.failback;

import org.springframework.stereotype.Service;

@Service
public class ManualDataSynchronizationService implements DataSynchronizationService {

    @Override
    public void synchronizeSecondaryToPrimary() {
        // Course-scope hook: a real deployment would run reviewed SQL sync scripts here.
    }
}
