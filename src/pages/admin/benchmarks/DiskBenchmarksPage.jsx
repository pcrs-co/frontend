import React from 'react';
import BenchmarkManager from '../../../components/admin/BenchmarkManager';

const DiskBenchmarksPage = () => {
    return (
        <BenchmarkManager
            resourceName="disk-benchmarks"
            title="Disk Benchmarks"
            fileTypeHint="Upload a file with 'drivename' and 'diskrating' columns."
            nameField="drive_name"
            scoreField="score"
        />
    );
};

export default DiskBenchmarksPage;