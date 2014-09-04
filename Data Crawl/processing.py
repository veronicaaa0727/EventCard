stopword = open('../stopword.txt')
stopwords = open('../local/stopwords.txt', 'w')

for word in stopword:
	if word != '\n':
		stopwords.write(word)

