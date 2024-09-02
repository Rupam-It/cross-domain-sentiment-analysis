package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	// Define input and output file paths
	inputTSV := "Kitchen1.tsv"
	outputCSV := "Kitchen1.csv"

	// Open the TSV file
	tsvFile, err := os.Open(inputTSV)
	if err != nil {
		panic(err)
	}
	defer tsvFile.Close()

	// Create a new CSV file
	csvFile, err := os.Create(outputCSV)
	if err != nil {
		panic(err)
	}
	defer csvFile.Close()

	// Create a CSV writer
	csvWriter := csv.NewWriter(csvFile)
	defer csvWriter.Flush()

	// Create a TSV reader
	tsvReader := bufio.NewReader(tsvFile)

	// Read the header line
	headerLine, err := tsvReader.ReadString('\n')
	if err != nil {
		panic(err)
	}

	// Split the header line to get column names
	columns := strings.Split(strings.TrimSpace(headerLine), "\t")

	// Find indices for relevant columns
	var starRatingIdx, reviewBodyIdx int
	var foundStarRating, foundReviewBody bool

	for i, col := range columns {
		if col == "star_rating" {
			starRatingIdx = i
			foundStarRating = true
		} else if col == "review_body" {
			reviewBodyIdx = i
			foundReviewBody = true
		}
	}

	if !foundStarRating || !foundReviewBody {
		fmt.Println("Error: Required columns not found in header")
		return
	}

	// Write the header to the new CSV file
	csvWriter.Write([]string{"star_rating", "review_body"})

	// Process each line in the TSV file
	for {
		line, err := tsvReader.ReadString('\n')
		if err != nil {
			if err.Error() == "EOF" {
				break
			}
			panic(err)
		}

		fields := strings.Split(strings.TrimSpace(line), "\t")

		if len(fields) <= starRatingIdx || len(fields) <= reviewBodyIdx {
			fmt.Printf("Warning: Skipping malformed line: %s\n", line)
			continue
		}

		// Convert star_rating
		starRating, err := strconv.Atoi(fields[starRatingIdx])
		if err != nil {
			fmt.Printf("Error converting star_rating: %v\n", err)
			continue
		}

		if starRating == 1 || starRating == 2 {
			fields[starRatingIdx] = "0"
		} else if starRating == 3 || starRating == 4 || starRating == 5 {
			fields[starRatingIdx] = "1"
		}

		// Write the row to the new CSV file
		csvWriter.Write([]string{fields[starRatingIdx], fields[reviewBodyIdx]})
	}
}
