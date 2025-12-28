import csv
import os
import glob

def format_csv(file_path):
    output_path = file_path.replace('.csv', '_formated.csv')
    columns_to_keep = ['Rows', 'Executes', 'StmtText', 'PhysicalOp', 'LogicalOp', 'TotalSubtreeCost']
    
    print(f"Processing {file_path} -> {output_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as infile:
            # Check if file is empty
            infile.seek(0, 2)
            if infile.tell() == 0:
                print(f"Skipping empty file: {file_path}")
                return
            infile.seek(0)
            
            reader = csv.DictReader(infile)
            
            # Verify columns exist
            if not reader.fieldnames:
                print(f"No headers found in {file_path}")
                return
                
            # Check if all required columns are present, if not, just keep what is available
            available_columns = [col for col in columns_to_keep if col in reader.fieldnames]
            
            if not available_columns:
                print(f"None of the target columns found in {file_path}")
                return

            with open(output_path, 'w', encoding='utf-8', newline='') as outfile:
                writer = csv.DictWriter(outfile, fieldnames=available_columns)
                writer.writeheader()
                
                for row in reader:
                    filtered_row = {col: row[col] for col in available_columns}
                    writer.writerow(filtered_row)
                    
        print(f"Successfully created {output_path}")
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Find all csv files recursively
    csv_files = glob.glob(os.path.join(base_dir, '**', '*.csv'), recursive=True)
    
    for file_path in csv_files:
        # Skip already formatted files
        if file_path.endswith('_formated.csv'):
            continue
            
        format_csv(file_path)

if __name__ == "__main__":
    main()
